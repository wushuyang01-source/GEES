// Simple test to verify LinkedIn app configuration
function testLinkedInConfig() {
    // Use actual config from config.js
    const config = {
        clientId: window.LINKEDIN_CONFIG.CLIENT_ID,
        redirectUri: window.location.origin + '/page/news.html',
        scope: window.LINKEDIN_CONFIG.SCOPE
    };

    console.log('=== LinkedIn App Configuration Test ===');
    console.log('Client ID:', config.clientId);
    console.log('Redirect URI:', config.redirectUri);
    console.log('Scope:', config.scope);
    console.log('Current URL:', window.location.href);

    // Test authorization URL generation
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${config.clientId}&` +
        `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
        `scope=${encodeURIComponent(config.scope)}&` +
        `state=test123`;

    console.log('Generated Auth URL:', authUrl);
    
    // Test LinkedIn API class initialization
    try {
        const linkedInAPI = new LinkedInAPI();
        console.log('✅ LinkedIn API class initialized successfully');
        console.log('Auth URL from class:', linkedInAPI.getAuthUrl());
        
        // Test if already authenticated
        if (linkedInAPI.isAuthenticated()) {
            console.log('✅ User is already authenticated');
        } else {
            console.log('❌ User is not authenticated - will need to login');
        }
        
    } catch (error) {
        console.error('❌ Error initializing LinkedIn API:', error);
    }
    
    return authUrl;
}

// Test redirect URI configuration
function testRedirectURI() {
    const currentUrl = window.location.href;
    const configuredRedirect = window.LINKEDIN_CONFIG.REDIRECT_URI;
    const actualRedirect = window.location.origin + '/page/news.html';
    
    console.log('=== Redirect URI Test ===');
    console.log('Current URL:', currentUrl);
    console.log('Configured Redirect:', configuredRedirect);
    console.log('Actual Redirect:', actualRedirect);
    
    if (configuredRedirect !== actualRedirect) {
        console.warn('⚠️ Redirect URI mismatch! Update config.js or LinkedIn app settings');
        console.log('Suggested fix: Update REDIRECT_URI in config.js to:', actualRedirect);
    } else {
        console.log('✅ Redirect URI matches');
    }
}

// Test for OAuth callback parameters
function testOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    console.log('=== OAuth Callback Test ===');
    
    if (error) {
        console.error('❌ OAuth Error:', error);
        console.error('Error Description:', urlParams.get('error_description'));
    } else if (code) {
        console.log('✅ OAuth Code received:', code);
        console.log('State parameter:', state);
        
        // Test token exchange (simulated)
        console.log('Ready to exchange code for access token');
    } else {
        console.log('No OAuth parameters found - user needs to authenticate');
    }
}

// Run all tests when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting LinkedIn integration tests...');
    
    // Wait for config to load
    if (window.LINKEDIN_CONFIG) {
        testLinkedInConfig();
        testRedirectURI();
        testOAuthCallback();
    } else {
        console.error('❌ LINKEDIN_CONFIG not found. Make sure config.js is loaded first.');
    }
});