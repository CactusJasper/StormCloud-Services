import * as React from 'react';
import { Card } from '../components';

const Contentpolicy = () => {
    return (
        <div className="layout">
            <div className="flex flex-center">
                <Card colour="primary">
                    <h3 className="text-center">Content Policy</h3>
                    <p>
                        Stormcloud Services is provided as is service and is to be used within accordance to the rules
                        set out by the Stormcloud Discord Server.<br/><br/>
                        This site while using its own styling does use content not owned by the developer see listed
                        below
                        <br/><b>Discord Logo (Footer, Sign In Button) - "Discord Inc."</b>
                    </p>
                </Card>
            </div>
        </div>
    );
}

export default Contentpolicy;