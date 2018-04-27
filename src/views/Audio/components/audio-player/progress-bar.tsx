import * as React from 'react';

export interface Props {
	trackPosition: number | null;
	trackDuration: number | null;
	seek(position: number): Promise<void>;
}

const ProgressBar: React.SFC<Props> = ({ trackPosition, trackDuration, seek }) => {
	function getPrettyTime(ms: number | null): string {
		if (ms === null) {
			return '0:00';
		}

		let seconds = Math.floor(ms / 1000);
		let minutes = Math.floor(seconds / 60);
		seconds -= minutes * 60;
	
		return `${minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
	}

	function onSeek(e: React.MouseEvent<HTMLDivElement>): void {
		if (trackDuration) {
			const percent = e.clientX / e.currentTarget.clientWidth; 
			seek(Math.floor(trackDuration * percent));
		}
	}

	const progressPercent = trackPosition !== null && trackDuration !== null
		? (trackPosition / trackDuration) * 100 : 0;

	return (
		<div className="time" onClick={onSeek}>
			<span>{ getPrettyTime(trackPosition) }/{ getPrettyTime(trackDuration) }</span>
			<span className="track-progress" style={{ width: `${progressPercent}%` }}></span>
		</div>
	);
}

export default ProgressBar;
