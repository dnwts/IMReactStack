import React, { PropTypes, Component } from 'react';

class Footer extends Component {
    render() {
        return <footer></footer>;
    }
}

Footer.propTypes = {
    strings: PropTypes.object.isRequired,
};

Footer.defaultProps = {
    strings: {
    },
};

export default Footer;