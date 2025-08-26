// LinkedIn credentials and configuration
const LINKEDIN_CONFIG = {
    CLIENT_ID: '86k14nr1tz4z7q',
    CLIENT_SECRET: 'WPL_AP1.vNl3BQBO16Z7N7Hh.LN2fZQ==',
    REDIRECT_URI: 'http://127.0.0.1:63191/page/news.html', // Static URL - update port if different
    SCOPE: 'r_liteprofile r_emailaddress w_member_social'
};

// Export for use in other files
window.LINKEDIN_CONFIG = LINKEDIN_CONFIG;

// Debug configuration
console.log('LinkedIn Config loaded:', {
    clientId: LINKEDIN_CONFIG.CLIENT_ID,
    redirectUri: LINKEDIN_CONFIG.REDIRECT_URI,
    scope: LINKEDIN_CONFIG.SCOPE
});