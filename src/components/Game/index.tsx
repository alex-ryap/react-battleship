import { Component, ReactNode } from 'react';
import { Button } from '../Button';
import { Field, FieldItem } from '../Field';
import { Settings } from '../Settings';
import './style.scss';

type Player = {
  field: Array<FieldItem>;
  isDeployOfShip: boolean;
  countAliveShips: number;
};

interface IProps {
  children?: ReactNode;
}

interface IState {
  player1: Player;
  player2: Player;
  isStarted: boolean;
  isTurnOfPlayer1: boolean;
  logs: Array<string>;
}

export class Game extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      player1: {
        field: [],
        isDeployOfShip: false,
        countAliveShips: 0,
      },
      player2: {
        field: [],
        isDeployOfShip: false,
        countAliveShips: 0,
      },
      isTurnOfPlayer1: true,
      isStarted: false,
      logs: [],
    };
  }

  componentDidMount() {
    this.newGame();
  }

  newGame = () => {
    console.log('New game');
    const player1 = { ...this.state.player1 };
    player1.field = this.createField();
    player1.isDeployOfShip = false;

    const player2 = { ...this.state.player2 };
    player2.field = this.createField();
    player2.isDeployOfShip = false;

    this.setState({
      player1: player1,
      player2: player2,
      isStarted: false,
    });
  };

  shot() {}

  createField(): Array<FieldItem> {
    const letters = ['0', 'A', 'B', 'C', 'D', 'E'];
    const numbers = ['0', '1', '2', '3', '4', '5'];
    let newField = [];

    newField = numbers.map((num) => {
      const row = letters.map((letter) => {
        return {
          x: letter,
          y: num,
          content: '',
          ship: false,
          shot: false,
        };
      });
      return row;
    });

    return newField.flat(1);
  }

  addShip = (x: string, y: string) => {
    console.log(x, y);

    if (!this.state.player1.isDeployOfShip) {
      const player = { ...this.state.player1 };

      if (this.state.player1.countAliveShips >= 8) {
        player.isDeployOfShip = true;
        this.setState({ player1: player });
        return;
      }

      player.field.map((square) => {
        if (square.x === x && square.y === y) {
          player.countAliveShips = square.ship
            ? player.countAliveShips - 1
            : player.countAliveShips + 1;
          square.ship = !square.ship;
        }
        return square;
      });

      this.setState({
        player1: player,
      });
    } else {
      const player = { ...this.state.player2 };

      if (this.state.player2.countAliveShips >= 8) {
        player.isDeployOfShip = true;
        this.setState({ player2: player });
        return;
      }

      player.field.map((square) => {
        if (square.x === x && square.y === y) {
          player.countAliveShips = square.ship
            ? player.countAliveShips - 1
            : player.countAliveShips + 1;
          square.ship = !square.ship;
        }
        return square;
      });

      this.setState({
        player2: player,
      });
    }
  };

  shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    if (nextState.player1.countAliveShips >= 8)
      nextState.player1.isDeployOfShip = true;
    if (nextState.player2.countAliveShips >= 8)
      nextState.player2.isDeployOfShip = true;
    return true;
  }

  nextPlayer() {
    this.setState({
      isTurnOfPlayer1: false,
    });
  }

  startGame() {
    this.setState({ isStarted: true, isTurnOfPlayer1: true });
  }

  render(): ReactNode {
    return (
      <div className="game">
        <Settings numberPlayer={this.state.isTurnOfPlayer1 ? 1 : 2}>
          <Button text="New game" onClick={this.newGame} />
          <Button
            text={
              this.state.player1.isDeployOfShip &&
              this.state.player2.isDeployOfShip
                ? 'Start game'
                : 'Complete'
            }
            onClick={
              this.state.player1.isDeployOfShip &&
              this.state.player2.isDeployOfShip
                ? () => this.startGame()
                : () => this.nextPlayer()
            }
            status={!this.state.player1.isDeployOfShip}
          />
        </Settings>
        <div className="game__field">
          <Field
            field={
              this.state.isTurnOfPlayer1
                ? this.state.player1.field
                : this.state.player2.field
            }
            visible={true}
            addShip={this.addShip}
          />
          {this.state.isStarted ? (
            <Field
              field={
                this.state.isTurnOfPlayer1
                  ? this.state.player2.field
                  : this.state.player1.field
              }
              visible={false}
              addShip={this.addShip}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
