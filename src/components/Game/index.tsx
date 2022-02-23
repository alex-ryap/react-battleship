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

type Shot = {
  x: string;
  y: string;
};

interface IProps {
  children?: ReactNode;
}

interface IState {
  player1: Player;
  player2: Player;
  shotResult?: string; // результат выстрела
  isFault: boolean; // промах
  isWin: boolean;
  isStarted: boolean; // игра началась
  isReadyFields: boolean; // поля заполнены(готовы к игре)
  isReadyPlayer: boolean; // игроки готовы?
  isTurnOfPlayer1: boolean; // ход первого игрока?
  setShot: boolean; // выбрана клетка для атаки
  lastShot?: Shot; // координаты выбранной для выстрела клетки
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
      isWin: false,
      isTurnOfPlayer1: true,
      isReadyFields: false,
      isReadyPlayer: false,
      isFault: false,
      setShot: false,
      isStarted: false,
      shotResult:
        'Расставьте свои корабли(один клик по клетке - поставить, повторный клик убрать)',
      logs: [],
    };
    this.shot = this.shot.bind(this);
  }

  componentDidMount() {
    this.newGame();
  }

  newGame = () => {
    console.log('New game');

    // формируем пустые поля для обоих игроков
    // и устанавливаем флаг, что расстановка кораблей не завершена
    const player1: Player = {
      field: this.createField(),
      isDeployOfShip: false,
      countAliveShips: 0,
    };
    const player2: Player = {
      field: this.createField(),
      isDeployOfShip: false,
      countAliveShips: 0,
    };

    // обнуляем стейт
    this.setState({
      player1: player1,
      player2: player2,
      isStarted: false,
      isReadyFields: false,
      setShot: false,
      lastShot: { x: '', y: '' },
      isReadyPlayer: false,
      isTurnOfPlayer1: true,
      isWin: false,
      isFault: false,
      shotResult:
        'Расставьте свои корабли(один клик по клетке - поставить, повторный клик убрать)',
    });
  };

  shot(x: string, y: string) {
    console.log(`shot on [${x}, ${y}]`);

    // определяем на поле какого игрока будет выполнен выстрел
    const player = this.state.isTurnOfPlayer1
      ? this.state.player2
      : this.state.player1;

    let shooting = this.state.setShot;
    let lastShot = this.state.lastShot;

    if (!this.state.setShot) {
      player.field.map((square) => {
        if (square.x === x && square.y === y && !square.content) {
          square.shot = !square.shot;
          shooting = true;
          lastShot = { x, y };
        }
        return square;
      });
    } else if (this.state.lastShot?.x === x && this.state.lastShot?.y === y) {
      player.field.map((square) => {
        if (square.x === x && square.y === y && !square.content)
          square.shot = !square.shot;
        return square;
      });
      shooting = false;
    }

    this.state.isTurnOfPlayer1
      ? this.setState({
          player2: player,
          setShot: shooting,
          lastShot: lastShot,
        })
      : this.setState({
          player1: player,
          setShot: shooting,
          lastShot: lastShot,
        });
  }

  /**
   * Создание поля для игрока
   * @returns пустое поле игрока
   */
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

  /**
   * Устанавливает/убирает корабль в выбранной клетке
   * @param x - координата Х корабля
   * @param y - координата У корабля
   */
  addShip = (x: string, y: string) => {
    console.log(`[${x}, ${y}]`);

    // определяем на поле какого из игроков был поставлен корабль
    const player = this.state.isTurnOfPlayer1
      ? { ...this.state.player1 }
      : { ...this.state.player2 };

    player.field.map((square) => {
      if (square.x === x && square.y === y) {
        // находим выбранную клетку и устанавливаем в ней корабль
        // или убираем, если корабль там уже стоит
        if (player.countAliveShips === 8 && square.ship) {
          square.ship = false;
          player.countAliveShips--;
          player.isDeployOfShip = false;
        } else if (player.countAliveShips < 8) {
          player.countAliveShips = square.ship
            ? player.countAliveShips - 1
            : player.countAliveShips + 1;
          square.ship = !square.ship;
        }
      }
      return square;
    });

    this.state.isTurnOfPlayer1
      ? this.setState({ player1: player })
      : this.setState({ player2: player });
  };

  shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    // мониторим количество расставленных кораблей игроков
    if (nextState.player1.countAliveShips >= 8)
      nextState.player1.isDeployOfShip = true;

    if (nextState.player2.countAliveShips >= 8)
      nextState.player2.isDeployOfShip = true;

    if (
      nextState.isStarted &&
      (nextState.player1.countAliveShips === 0 ||
        nextState.player2.countAliveShips === 0)
    ) {
      nextState.isWin = true;
      nextState.shotResult = 'Победил!';
    }

    if (nextState.isReadyFields && !nextState.isStarted)
      nextState.shotResult = '';

    return true;
  }

  nextPlayer() {
    // если оба поля игроков готовы, сообщаем об этом
    // либо меняем игрока дав возможность расставить корабли
    this.state.player1.isDeployOfShip && this.state.player2.isDeployOfShip
      ? this.setState({
          isReadyFields: true,
          isTurnOfPlayer1: !this.state.isTurnOfPlayer1,
        })
      : this.setState({ isTurnOfPlayer1: !this.state.isTurnOfPlayer1 });
  }

  startGame() {
    // начинает игру
    this.setState({
      isStarted: true,
      isReadyPlayer: true,
    });
  }

  confirmShot() {
    // определяем какой игрок делает выстрел
    const player = this.state.isTurnOfPlayer1
      ? this.state.player2
      : this.state.player1;

    let result = '';
    let isFault = this.state.isFault;

    player.field.map((square) => {
      if (
        square.x === this.state.lastShot?.x &&
        square.y === this.state.lastShot?.y
      ) {
        // если на выбранной клетке стоит корабль
        if (square.ship) {
          square.content = 'X';
          player.countAliveShips--;
          result = 'Попал!';
        } else {
          square.content = '·';
          result = 'Мимо :(';
          isFault = true;
        }
      }
      return square;
    });

    if (this.state.isTurnOfPlayer1) {
      this.setState({
        player2: player,
        shotResult: result,
        isFault,
        setShot: false,
      });
    } else {
      this.setState({
        player1: player,
        shotResult: result,
        isFault,
        setShot: false,
      });
    }
  }

  endTurn() {
    this.setState({
      isFault: false,
      isReadyPlayer: false,
      isTurnOfPlayer1: !this.state.isTurnOfPlayer1,
      setShot: false,
      shotResult: '',
    });
  }

  render(): ReactNode {
    return (
      <div className="game">
        <div className="game__action">
          {/* Кнопка для начала новой игры */}
          <Button text="Новая игра" onClick={this.newGame} />
        </div>
        {/* Отображение информации о текущем игроке */}
        <Settings
          numberPlayer={this.state.isTurnOfPlayer1 ? 1 : 2}
          shotResult={this.state.shotResult}
        >
          {!this.state.isReadyFields && (
            <Button
              text={'Подтвердить'}
              onClick={() => this.nextPlayer()}
              status={
                this.state.isTurnOfPlayer1
                  ? !this.state.player1.isDeployOfShip
                  : !this.state.player2.isDeployOfShip
              }
            />
          )}
          {this.state.isReadyFields && !this.state.isReadyPlayer && (
            <Button
              text={'Начать ход'}
              onClick={() => this.startGame()}
              status={!this.state.player1.isDeployOfShip}
            />
          )}

          {this.state.isStarted &&
          !this.state.isWin &&
          this.state.isReadyPlayer &&
          !this.state.isFault ? (
            <Button
              text="Атаковать"
              onClick={() => this.confirmShot()}
              status={!this.state.setShot}
            />
          ) : (
            ''
          )}

          {this.state.isStarted &&
          !this.state.isWin &&
          this.state.isReadyPlayer &&
          this.state.isFault ? (
            <Button
              text="Завершить ход"
              onClick={() => this.endTurn()}
              status={false}
            />
          ) : (
            ''
          )}
        </Settings>
        <div className="game__field">
          {!this.state.isReadyFields && !this.state.isStarted ? (
            <Field
              field={
                this.state.isTurnOfPlayer1
                  ? this.state.player1.field
                  : this.state.player2.field
              }
              visible={true}
              action={this.addShip}
              numberOfPlayer={this.state.isTurnOfPlayer1 ? 1 : 2}
            />
          ) : (
            ''
          )}
          {this.state.isStarted && this.state.isReadyPlayer ? (
            <>
              <Field
                field={
                  this.state.isTurnOfPlayer1
                    ? this.state.player1.field
                    : this.state.player2.field
                }
                visible={true}
                action={() => ''}
                numberOfPlayer={this.state.isTurnOfPlayer1 ? 1 : 2}
              />
              <Field
                field={
                  this.state.isTurnOfPlayer1
                    ? this.state.player2.field
                    : this.state.player1.field
                }
                visible={false}
                action={this.shot}
                numberOfPlayer={this.state.isTurnOfPlayer1 ? 2 : 1}
              />
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
