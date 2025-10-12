import { type } from 'os';
import React from 'react';

interface GreetingProps {
    name: string;
    edad?: number;
}

type GreetingPropsAlt = {
    name: string;
    edad?: number;
}

const Greeting: React.FC<GreetingProps> = ({ name, edad}) => {
    return (
        <div className='bg-blue-100 p-4 rounded-lg'>
            <h2 className='text-xl font-bold'>¡Hola, {name}!</h2>
            {edad && <p>Edad: {edad} años</p>}
        </div>
    );
};

export default Greeting;