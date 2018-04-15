import * as React from 'react';

import './overlay.scss';

export interface Props {
    isVisible: boolean;
}

const Overlay: React.SFC<Props> = ({ isVisible, children }) => {
    return isVisible ? <div className="overlay">{ children }</div> : null
};

export default Overlay;