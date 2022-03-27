import * as React from 'react';
import { Card } from '../components';

const PrivacyPolicy = () => {
    return (
        <div className="layout">
            <div className="flex flex-center">
                <Card colour="primary">
                    <h3 className="text-center">Privacy Policy</h3>
                    <p>
                        Stormcloud Services and the Stormcloud team value data privacy that is why we have put in place
                        required measures for protecting the data provided to us
                    </p>
                    <p>
                        We protect your data using AES256 encryption commonly referred to as Military Grade Encryption. This
                        is so that even if the database is compromised
                        your data will still be safe since it is stored as random strings of text that can only be
                        deciphered with the key that generated it.
                    </p>
                    <p>
                        The only data we store that links to you as an individual is your discord user ID this is so that we
                        can verify who you are and what content you created on our site.
                        As a temporary piece of information we might store your email this is a temporary stored bit of
                        information that is used when a request for your information is
                        submitted this is so we know that the person we are sending it to is really you the email is deleted
                        once the request has been fulfilled.
                    </p>
                    <p>For any Further questions regarding User Privacy please contact the developer on Discord: </p>
                    <p>Developer's Discord Account: 𝕵𝖆𝖘𝖕𝖊𝖗#5992 | Discord User ID: 217387293571284992</p>
                </Card>
            </div>
        </div>
    );
}

export default PrivacyPolicy;