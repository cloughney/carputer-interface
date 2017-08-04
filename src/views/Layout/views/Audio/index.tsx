import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router-dom';

import AppState from 'state';
import AudioSourceBrowser from './components/AudioSourceBrowser';

type Props = { };

type State = { };

type InjectedProps = Props & RouteComponentProps<void>;

class AudioView extends React.Component<InjectedProps, State> {
	private get redirectPath(): string {
		return `${this.props.match.url}/sources`;
	}

	public constructor(props: InjectedProps) {
		super(props);
		this.state = { };
	}

	public render(): JSX.Element {


		return (
			<div className="container-fluid">
				<Switch>
					<Route exact path={ this.props.match.url } render={ () => <Redirect to={ this.redirectPath } /> } />
					<Route path={ `${this.props.match.url}/sources` } component={ AudioSourceBrowser } />
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state: AppState): Props => ({ });
const mapDispatchToProps = (dispatch: Dispatch<Action>): Props => ({ });

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioView);
