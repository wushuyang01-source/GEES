class LinkedInAPI {
    constructor() {
        // Use config from config.js
        this.clientId = window.LINKEDIN_CONFIG.CLIENT_ID;
        this.clientSecret = window.LINKEDIN_CONFIG.CLIENT_SECRET;
        this.redirectUri = window.LINKEDIN_CONFIG.REDIRECT_URI;
        this.scope = window.LINKEDIN_CONFIG.SCOPE;
        
        this.accessToken = localStorage.getItem('linkedin_access_token');
        this.apiBase = 'https://api.linkedin.com/v2';
    }

    // Authorization URL
    getAuthUrl() {
        const state = this.generateRandomState();
        localStorage.setItem('linkedin_oauth_state', state); // Store state here too
        
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope,
            state: state
        });
        
        return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    }

    // Generate random state for OAuth security
    generateRandomState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    // Redirect to LinkedIn for authorization
    authorize() {
        window.location.href = this.getAuthUrl();
    }

    // Validate OAuth state (security check)
    validateState(receivedState) {
        const storedState = localStorage.getItem('linkedin_oauth_state');
        localStorage.removeItem('linkedin_oauth_state');
        return storedState === receivedState;
    }

    // Exchange authorization code for access token
    async getAccessToken(code, state) {
        // Validate state parameter
        if (!this.validateState(state)) {
            throw new Error('Invalid OAuth state parameter');
        }

        const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri
        });

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            localStorage.setItem('linkedin_access_token', this.accessToken);
            localStorage.setItem('linkedin_token_expires', Date.now() + (data.expires_in * 1000));
            
            return data;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    }

    // Check if token is expired
    isTokenExpired() {
        const expiryTime = localStorage.getItem('linkedin_token_expires');
        return expiryTime && Date.now() > parseInt(expiryTime);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.accessToken && !this.isTokenExpired();
    }

    // Get user profile
    async getProfile() {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated or token expired');
        }

        try {
            const response = await fetch(`${this.apiBase}/people/~`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    // Get user's posts
    async getPosts() {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated or token expired');
        }

        try {
            const profile = await this.getProfile();
            const personUrn = `urn:li:person:${profile.id}`;

            const response = await fetch(
                `${this.apiBase}/shares?q=owners&owners=${personUrn}&count=10&sortBy=CREATED`, 
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.elements || [];
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }

    // Logout and clear tokens
    logout() {
        localStorage.removeItem('linkedin_access_token');
        localStorage.removeItem('linkedin_token_expires');
        localStorage.removeItem('linkedin_oauth_state');
        this.accessToken = null;
    }
}