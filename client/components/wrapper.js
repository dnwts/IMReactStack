import React, { Component } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import TranslationProvider from '../containers/translationProvider';
import Header from '../containers/headerContainer';
import Grid from './grid';

class Wrapper extends Component {
    render() {
        return (<TranslationProvider id="page-wrapper">
            <Header className="top" />
            <ReactTransitionGroup component="div" id="page-container">
                {React.cloneElement(this.props.children, { key: location.pathname })}
            </ReactTransitionGroup>
            <Grid />
        </TranslationProvider>);
    }
}

export default Wrapper; 