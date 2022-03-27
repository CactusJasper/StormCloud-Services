import * as React from 'react';

type Params = {
    colour: 'primary' | 'secondary';
}

export const Card: React.FC<Params> = ({ children , colour = 'primary' }): JSX.Element => {
    return (
        <div className={`card ${colour === 'primary' ? 'primary' : 'secondary'}`}>
            {children}
        </div>
    );
}