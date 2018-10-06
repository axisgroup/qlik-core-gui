// @flow
import React from 'react';
import './configInput.css';

type Props = {
    increment: () => void,
    incrementIfOdd: () => void,
    incrementAsync: () => void,
    decrement: () => void,
    counter: number
  };

const TextInput = () => {
    return (
        <input></input>
    )
}

export default TextInput;