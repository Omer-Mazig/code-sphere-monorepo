// Only import ngrok in development
let ngrok: any = null;

/**
 * Set up ngrok tunnel for development environment
 */
export async function setupNgrokTunnel(port: number): Promise<void> {
  // Only try to use ngrok in development environment
  if (process.env.NODE_ENV !== 'production') {
    try {
      // Lazy load ngrok only when needed in development
      if (!ngrok) {
        try {
          const ngrokModule = await import('ngrok');
          ngrok = ngrokModule.default || ngrokModule;
        } catch (importError) {
          console.error('Failed to import ngrok:', importError);
          return;
        }
      }

      // Get the authtoken from environment variable
      const authtoken = process.env.NGROK_AUTHTOKEN;

      // Don't proceed if no token is provided
      if (!authtoken) {
        console.warn(
          '\x1b[33m%s\x1b[0m',
          'Ngrok authtoken not found. Set NGROK_AUTHTOKEN environment variable to enable tunneling.',
        );
        return;
      }

      // Start ngrok with auth token
      const url = await ngrok.connect({
        addr: port,
        authtoken,
        region: 'eu', // Set to your region (eu, us, au, ap, sa, jp, in)
      });

      console.log(`Ngrok tunnel is active: ${url}`);
      console.log(`Webhook URL: ${url}/api/webhooks`);

      // Log a reminder to update Clerk dashboard
      console.log(
        '\x1b[33m%s\x1b[0m',
        '⚠️  IMPORTANT: Update your webhook URL in Clerk Dashboard',
      );
    } catch (error) {
      console.error('Error starting ngrok:', error);
    }
  } else {
    // In production, simply log that ngrok is not being used
    console.log('Running in production mode - ngrok tunnel not started');
  }
}
