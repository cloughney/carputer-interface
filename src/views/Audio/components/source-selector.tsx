import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { AudioState, AudioSourceState } from 'state';
import { audioSourceService } from 'services/audio';
import Overlay from 'components/overlay';

const ErrorDialog: React.SFC<{ error: string, exit(): void }> = ({ error, exit }) => (
	<div className="fail">
		<span>Failed to switch audio source:<br />{error}</span><br />
		<button onClick={ exit }>Okay</button>
	</div>
)

const SourceItem: React.SFC<{ sourceKey: string, select(): void }> = ({ sourceKey, select }) => (
	<button onClick={ select }>{sourceKey}</button>
)

export interface Props extends RouteComponentProps<void> {
	audioState: AudioState;
	playerPath: string;
	setAudioSource(key: string): Promise<void>;
	resetState(): void;
}

export interface State {
	isNewSourceSelected: boolean;
}

export default class SourceSelector extends React.Component<Props, State> {	
	public constructor(props: Props) {
		super(props);

		const { audioState, location } = props;
		this.state = {
			isNewSourceSelected: false
		};
	}

	private get authResponse(): boolean | null {
		const { location } = this.props;
		return location.state !== undefined && location.state.authSuccess !== undefined
			? location.state.authSuccess
			: null;
	}

	private get overlayMessage(): JSX.Element | null {
		const { audioState, resetState } = this.props;

		if (audioState.state === AudioSourceState.Error) {
			return <ErrorDialog error={audioState.error} exit={resetState} />;
		}

		if (this.authResponse === false) {
			return <ErrorDialog error="Failed to authenticate audio source." exit={resetState} />;
		}

		if (audioState.state === AudioSourceState.Switching || this.authResponse) {
			return <span>Initializing audio source...</span>;
		}

		return null;
	}

	public componentDidMount(): void {
		const { audioState, setAudioSource } = this.props;
		if (audioState.state === AudioSourceState.RequiresAuthentication && this.authResponse) {
			this.selectAudioSource(audioState.key);
		}
	}

	public render() {
		const { audioState, playerPath } = this.props;

		if (this.state.isNewSourceSelected && audioState.state === AudioSourceState.Initialized) {
			return <Redirect to={playerPath} />;
		}

		if (audioState.state === AudioSourceState.RequiresAuthentication && this.authResponse === null) {
			return <Redirect to={`/audio/connect/${audioState.key}`} />;
		}

		const overlayMessage = this.overlayMessage;

		return (
			<div className="sources with-overlay">
				{ audioSourceService.availableSources
					.map(x => <SourceItem key={x.key} sourceKey={x.key} select={() => this.selectAudioSource(x.key)} />) }
				
				<Overlay isVisible={overlayMessage !== null}>{overlayMessage}</Overlay>
			</div>
		)
	}

	private selectAudioSource = async (key: string): Promise<void> => {
		this.setState({ isNewSourceSelected: true });
		await this.props.setAudioSource(key);
	}
}
