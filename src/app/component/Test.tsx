import React from "react";

export class ClassTest extends React.Component{
    render(): React.ReactNode {
        return(
            <p>this is class test</p>
        );
    }
}

export const MethodTest = () => {
    return(
        <p>this is method test</p>
    );
}