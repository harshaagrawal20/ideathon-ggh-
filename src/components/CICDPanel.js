import React, { useState, useEffect, useCallback } from 'react';
import { initializePipeline, triggerBuild, deployApplication, checkGithubBuildStatus, checkJenkinsBuildStatus } from '../services/cicdService';

const CICDPanel = ({ code, provider = 'github', platform = 'vercel' }) => {
  const [pipelineStatus, setPipelineStatus] = useState(null);
  const [buildStatus, setBuildStatus] = useState(null);
  const [deployStatus, setDeployStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [isLoading, setIsLoading] = useState(false);
  const [providerConfig, setProviderConfig] = useState({
    name: '',
    branch: 'main',
    buildSteps: [],
    environment: 'development',
    platform: 'vercel',
    bucket: '',
  });

  const initializeNewPipeline = useCallback(async () => {
    try {
      setIsLoading(true);
      addLog('Info', 'Initializing pipeline...');
      const result = await initializePipeline(provider, {
        repository: providerConfig.name || 'user/repo',
        branch: providerConfig.branch
      });
      setPipelineStatus(result);
      addLog('Success', 'Pipeline initialized successfully');
    } catch (error) {
      addLog('Error', `Pipeline initialization failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [provider, providerConfig.name, providerConfig.branch]);

  useEffect(() => {
    initializeNewPipeline();
  }, [initializeNewPipeline]);

  useEffect(() => {
    return () => {
      // Cleanup polling intervals when component unmounts
      if (window.buildPollInterval) {
        clearInterval(window.buildPollInterval);
      }
      if (window.deployPollInterval) {
        clearInterval(window.deployPollInterval);
      }
    };
  }, []);

  const handleBuildTrigger = async () => {
    try {
      setIsLoading(true);
      addLog('Info', 'Triggering build...');
      
      const buildConfig = {
        name: providerConfig.name || 'web-app-build',
        steps: providerConfig.buildSteps.length > 0 
          ? providerConfig.buildSteps 
          : ['npm install', 'npm test', 'npm run build'],
        triggers: ['push', 'pull_request'],
        environment: providerConfig.environment
      };

      const result = await triggerBuild(pipelineStatus, code, buildConfig);
      setBuildStatus(result);
      addLog('Success', 'Build triggered successfully', result);
      
      // Poll for build status
      startBuildStatusPolling(result.buildId);
    } catch (error) {
      addLog('Error', `Build trigger failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startBuildStatusPolling = (buildId) => {
    if (window.buildPollInterval) {
      clearInterval(window.buildPollInterval);
    }
    window.buildPollInterval = setInterval(async () => {
      try {
        // Implement status checking based on your CI provider
        const status = await checkBuildStatus(buildId);
        setBuildStatus(prev => ({ ...prev, ...status }));
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(window.buildPollInterval);
          addLog('Info', `Build ${status.status}`);
        }
      } catch (error) {
        console.error('Build status check failed:', error);
      }
    }, 10000); // Poll every 10 seconds
  };

  const handleDeploy = async () => {
    try {
      setIsLoading(true);
      addLog('Info', 'Starting deployment...');

      if (!buildStatus || buildStatus.status === 'error') {
        throw new Error('Cannot deploy: Build not successful');
      }

      const deployConfig = {
        platform: providerConfig.platform,
        environment: providerConfig.environment,
        bucket: providerConfig.bucket,
        region: 'us-east-1'
      };

      const result = await deployApplication(buildStatus, providerConfig.platform, deployConfig);
      setDeployStatus(result);
      addLog('Success', 'Deployment started successfully', result);

      // Poll for deployment status
      startDeploymentStatusPolling(result.deploymentId);
    } catch (error) {
      addLog('Error', `Deployment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startDeploymentStatusPolling = (deploymentId) => {
    if (window.deployPollInterval) {
      clearInterval(window.deployPollInterval);
    }
    window.deployPollInterval = setInterval(async () => {
      try {
        // Implement status checking based on your deployment platform
        const status = await checkDeploymentStatus(deploymentId);
        setDeployStatus(prev => ({ ...prev, ...status }));
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(window.deployPollInterval);
          addLog('Info', `Deployment ${status.status}`);
        }
      } catch (error) {
        console.error('Deployment status check failed:', error);
      }
    }, 10000); // Poll every 10 seconds
  };

  const handleConfigSave = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      addLog('Info', 'Saving pipeline configuration...');
      
      // Validate configuration
      if (!providerConfig.name) {
        throw new Error('Job name is required');
      }

      // Save configuration and reinitialize pipeline
      await initializeNewPipeline();
      addLog('Success', 'Configuration saved successfully');
    } catch (error) {
      addLog('Error', `Configuration save failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addLog = (type, message, data = null) => {
    setLogs(prev => [...prev, {
      type,
      message: typeof message === 'object' ? JSON.stringify(message, null, 2) : message,
      data: data ? JSON.stringify(data, null, 2) : null,
      timestamp: new Date().toISOString()
    }]);
  };

  // Add these helper functions
  const checkBuildStatus = async (buildId) => {
    try {
      let status;
      switch (provider) {
        case 'github':
          status = await checkGithubBuildStatus(buildId, {
            repository: providerConfig.name || 'user/repo'
          });
          break;
        case 'jenkins':
          status = await checkJenkinsBuildStatus(buildId, {
            name: providerConfig.name
          });
          break;
        default:
          status = { status: 'in_progress' }; // Placeholder
      }
      return status;
    } catch (error) {
      console.error('Build status check failed:', error);
      return { status: 'error', error: error.message };
    }
  };

  const checkDeploymentStatus = async (deploymentId) => {
    try {
      let status;
      switch (providerConfig.platform) {
        case 'vercel':
          status = await fetch(`https://api.vercel.com/v1/deployments/${deploymentId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_VERCEL_TOKEN}`
            }
          }).then(res => res.json());
          return {
            status: status.readyState === 'READY' ? 'completed' : 
                    status.readyState === 'ERROR' ? 'failed' : 
                    'in_progress',
            url: status.url
          };
        
        case 'aws':
          // Check S3 deployment status
          const AWS = require('aws-sdk');
          const s3 = new AWS.S3();
          const params = {
            Bucket: providerConfig.bucket
          };
          await s3.headBucket(params).promise();
          return { status: 'completed' };
        
        default:
          return { status: 'in_progress' };
      }
    } catch (error) {
      console.error('Deployment status check failed:', error);
      return { status: 'error', error: error.message };
    }
  };

  return (
    <div className="cicd-panel">
      <h3>CI/CD Pipeline</h3>
      
      <div className="pipeline-tabs">
        <button 
          className={`tab-button ${activeTab === 'pipeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('pipeline')}
        >
          Pipeline Status
        </button>
        <button 
          className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Build Logs
        </button>
        <button 
          className={`tab-button ${activeTab === 'deploy' ? 'active' : ''}`}
          onClick={() => setActiveTab('deploy')}
        >
          Deployment
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'pipeline' && (
        <div className="pipeline-status">
          <div className="status-item">
            <h4>Pipeline Status</h4>
            <span className={`status-badge ${pipelineStatus?.status}`}>
              {pipelineStatus?.status || 'Not initialized'}
            </span>
          </div>

          <div className="status-item">
            <h4>Build Status</h4>
            <span className={`status-badge ${buildStatus?.status}`}>
              {buildStatus?.status || 'Not started'}
            </span>
            <button 
              className="action-button"
              onClick={handleBuildTrigger}
              disabled={!pipelineStatus || pipelineStatus.status === 'error'}
            >
              Trigger Build
            </button>
          </div>

          <div className="status-item">
            <h4>Deployment Status</h4>
            <span className={`status-badge ${deployStatus?.status}`}>
              {deployStatus?.status || 'Not deployed'}
            </span>
            <button 
              className="action-button"
              onClick={handleDeploy}
              disabled={!buildStatus || buildStatus.status === 'error'}
            >
              Deploy
            </button>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="build-logs">
          <div className="logs-container">
            {logs.map((log, index) => (
              <div key={index} className={`log-entry ${log.type.toLowerCase()}`}>
                <span className="log-timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="log-type">{log.type}</span>
                <pre className="log-message">{log.message}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'deploy' && (
        <div className="deployment-info">
          {deployStatus?.url && (
            <div className="deployment-url">
              <h4>Deployment URL</h4>
              <a href={deployStatus.url} target="_blank" rel="noopener noreferrer">
                {deployStatus.url}
              </a>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="provider-settings">
          <h4>Jenkins Pipeline Configuration</h4>
          <form onSubmit={handleConfigSave}>
            <div className="form-group">
              <label>Job Name</label>
              <input
                type="text"
                value={providerConfig.name}
                onChange={(e) => setProviderConfig({
                  ...providerConfig,
                  name: e.target.value
                })}
                placeholder="my-pipeline-job"
                required
              />
            </div>

            <div className="form-group">
              <label>Branch</label>
              <input
                type="text"
                value={providerConfig.branch}
                onChange={(e) => setProviderConfig({
                  ...providerConfig,
                  branch: e.target.value
                })}
                placeholder="main"
                required
              />
            </div>

            <div className="form-group">
              <label>Environment</label>
              <select
                value={providerConfig.environment}
                onChange={(e) => setProviderConfig({
                  ...providerConfig,
                  environment: e.target.value
                })}
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>

            <div className="form-group">
              <label>Deployment Platform</label>
              <select
                value={providerConfig.platform}
                onChange={(e) => setProviderConfig({
                  ...providerConfig,
                  platform: e.target.value
                })}
              >
                <option value="vercel">Vercel</option>
                <option value="firebase">Firebase</option>
                <option value="aws">AWS S3</option>
              </select>
            </div>

            {providerConfig.platform === 'aws' && (
              <div className="form-group">
                <label>S3 Bucket Name</label>
                <input
                  type="text"
                  value={providerConfig.bucket}
                  onChange={(e) => setProviderConfig({
                    ...providerConfig,
                    bucket: e.target.value
                  })}
                  placeholder="my-app-bucket"
                />
              </div>
            )}

            <div className="form-group">
              <label>Additional Build Steps (one per line)</label>
              <textarea
                value={providerConfig.buildSteps.join('\n')}
                onChange={(e) => setProviderConfig({
                  ...providerConfig,
                  buildSteps: e.target.value.split('\n').filter(Boolean)
                })}
                placeholder="npm run lint&#10;npm run test:coverage&#10;npm run build:prod"
              />
            </div>

            <button type="submit" className="action-button">
              Save Pipeline Configuration
            </button>
          </form>
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
};

export default CICDPanel; 