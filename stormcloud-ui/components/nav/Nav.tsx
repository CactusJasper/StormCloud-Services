import * as React from 'react';

export const Nav: React.FC = (): JSX.Element => {
    return (
        <header className="flex">
            <div>
                <a href="/"><h2>Stormcloud</h2></a>
            </div>
        </header>
    );
}