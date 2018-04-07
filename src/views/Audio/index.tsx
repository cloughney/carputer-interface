import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './audio.scss';

import { AppState } from 'state';
import AudioPlayer from '../../components/AudioPlayer';

const AudioView: React.SFC<{}> = (props) => {
	return (
		<div className="container-fluid">
			<AudioPlayer />
		</div>
	);
}

const mapStateToProps = (state: AppState) => ({});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
