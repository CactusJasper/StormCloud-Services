import type { NextPage } from 'next';
import { Card } from '../components';

const AuthPage: NextPage = () => {
  return (
      <main className="layout auth">
          <div className="flex flex-center">
              <Card colour="primary">
                  <h1 className="text-center">Stormcloud Services</h1>
                  <h2 className="text-center">Login</h2>
                  <div className="flex flex-center">
					  {/* TODO: Replace this with env vars */}
                      <a href="https://discord.com/api/oauth2/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fdiscord&scope=identify%20guilds&client_id=783811510652239904" className="button">
						  <i className="bi bi-discord va-m fs-18"/>
                          &nbsp;&nbsp;Login With Discord
                      </a>
                  </div>
              </Card>
          </div>
      </main>
  );
}

export default AuthPage;
