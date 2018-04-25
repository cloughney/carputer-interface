import * as React from 'react';
import ProgressBar from './progress-bar';

export interface Props {
	isPlaying: boolean;
	trackPosition: number | null;
	trackDuration: number | null;
	controls: {
		play(): Promise<void>;
		pause(): Promise<void>;
		next(): Promise<void>;
		previous(): Promise<void>;
		seek(position: number): Promise<void>;
	}
}

const PlaybackControls: React.SFC<Props> = ({ isPlaying, trackPosition, trackDuration, controls }) => {
	const togglePlayButton = isPlaying
		? <button className="pause" onClick={() => controls.pause()} />
		: <button className="play" onClick={() => controls.play()} />;

	return (
		<div className="controls">
			<ProgressBar trackPosition={trackPosition} trackDuration={trackDuration} seek={controls.seek} />
			<button className="previous" onClick={() => controls.previous()} />
			{ togglePlayButton }
			<button className="next" onClick={() => controls.next()} />
		</div>
	)
}

export default PlaybackControls;
