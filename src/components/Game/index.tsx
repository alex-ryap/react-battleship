import { Component, ReactNode } from 'react';
import { Button } from '../Button';
import { Field } from '../Field';
import { UserAction } from '../UserAction';
import { Player, Shot, Square } from '../../utils/types';
import './style.scss';

interface IProps {}

interface IState {
  player1: Player;
  player2: Player;
  actionInfo: string;
  isFail: boolean;
  isWin: boolean;
  isStarted: boolean;
  isReadyFields: boolean;
  isReadyPlayer: boolean;
  isTurnOfPlayer1: boolean;
  isMakeShot: boolean;
  lastShot?: Shot;
}

export class Game extends Component<{}, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      player1: {
        name: 'Player1',
        field: [],
        isInstalledShips: false,
        numberOfShips: 0,
      },
      player2: {
        name: 'Player2',
        field: [],
        isInstalledShips: false,
        numberOfShips: 0,
      },

      isWin: false,
      isFail: false,
      isStarted: false,
      isMakeShot: false,
      isReadyFields: false,
      isReadyPlayer: false,
      isTurnOfPlayer1: true,
      actionInfo:
        'Расставьте свои корабли(один клик по клетке - поставить, повторный клик убрать)',
    };
  }

  /**
   * монтирование компонента
   */
  componentDidMount() {
    this.newGame();
  }

  /**
   * новая игра
   */
  newGame = () => {
    // формируем пустые поля для всех игроков
    // и устанавливаем флаг, что расстановка кораблей не завершена
    const player1: Player = {
      name: 'Игрок 1',
      field: this.createField(),
      isInstalledShips: false,
      numberOfShips: 0,
    };
    const player2: Player = {
      name: 'Игрок 2',
      field: this.createField(),
      isInstalledShips: false,
      numberOfShips: 0,
    };

    // обнуляем стейт
    this.setState({
      player1: player1,
      player2: player2,
      isStarted: false,
      isReadyFields: false,
      isMakeShot: false,
      lastShot: { x: '', y: '' },
      isReadyPlayer: false,
      isTurnOfPlayer1: true,
      isWin: false,
      isFail: false,
      actionInfo:
        'Расставьте свои корабли(один клик по клетке - поставить, повторный клик убрать)',
    });
  };

  /**
   * Создание поля для игрока
   * @returns пустое поле игрока
   */
  createField(): Array<Square> {
    const letters = ['0', 'A', 'B', 'C', 'D', 'E'];
    const numbers = ['0', '1', '2', '3', '4', '5'];

    const newField = numbers.map((num) => {
      const row = letters.map((letter) => {
        return {
          x: letter,
          y: num,
          content: '',
          isContainShip: false,
          isContainShot: false,
        };
      });
      return row;
    });

    return newField.flat(1);
  }

  /**
   * Метод жизненного цикла компонента
   * @param nextProps обновленные пропсы
   * @param nextState обновленное состояние
   * @returns обновляем состояние или нет
   */
  shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    // отслеживаем количество расставленных кораблей игроков
    if (nextState.player1.numberOfShips >= 8)
      nextState.player1.isInstalledShips = true;

    if (nextState.player2.numberOfShips >= 8)
      nextState.player2.isInstalledShips = true;

    // отслеживаем победителя
    if (
      nextState.isStarted &&
      (nextState.player1.numberOfShips === 0 ||
        nextState.player2.numberOfShips === 0)
    ) {
      nextState.isWin = true;
      nextState.actionInfo = 'Победил!';
    }

    // отключаем отображение сообщения о расстановке кораблей
    if (nextState.isReadyFields && !nextState.isStarted)
      nextState.actionInfo = '';

    return true;
  }

  /**
   * меняет игрока
   */
  switchPlayer() {
    // если оба поля игроков готовы, сообщаем об этом
    // либо меняем игрока, дав возможность ходить другому
    this.state.player1.isInstalledShips && this.state.player2.isInstalledShips
      ? this.setState({
          isReadyFields: true,
          isTurnOfPlayer1: !this.state.isTurnOfPlayer1,
        })
      : this.setState({ isTurnOfPlayer1: !this.state.isTurnOfPlayer1 });
  }

  /**
   * начинает игру
   */
  startGame() {
    this.setState({
      isStarted: true,
      isReadyPlayer: true,
    });
  }

  /**
   * завершает ход игрока
   */
  endTurn() {
    this.setState({
      isFail: false,
      isReadyPlayer: false,
      isTurnOfPlayer1: !this.state.isTurnOfPlayer1,
      isMakeShot: false,
      actionInfo: '',
    });
  }

  /**
   * подтверждение выстрела
   */
  confirmShot() {
    // определяем какой игрок делает выстрел
    const player = this.state.isTurnOfPlayer1
      ? this.state.player2
      : this.state.player1;

    let result = '';
    let isMakeShot = this.state.isMakeShot;
    let isFail = this.state.isFail;

    player.field.map((square) => {
      if (
        square.x === this.state.lastShot?.x &&
        square.y === this.state.lastShot?.y
      ) {
        // если на выбранной клетке стоит корабль
        if (square.isContainShip) {
          square.content = 'X';
          player.numberOfShips--;
          result = 'Попал!';
          isMakeShot = false;
        } else {
          square.content = '·';
          result = 'Мимо :(';
          isFail = true;
        }
      }
      return square;
    });

    if (this.state.isTurnOfPlayer1) {
      this.setState({
        player2: player,
        actionInfo: result,
        isFail,
        isMakeShot,
      });
    } else {
      this.setState({
        player1: player,
        actionInfo: result,
        isFail,
        isMakeShot,
      });
    }
  }

  /**
   * Устанавливает/убирает корабль в выбранной клетке
   * @param x - координата Х корабля
   * @param y - координата У корабля
   */
  handlerClick = (x: string, y: string) => {
    // определяем на поле какого из игроков был поставлен корабль
    let player: Player;
    let shooting = this.state.isMakeShot;
    let lastShot = this.state.lastShot;

    // если игра начата, то выполняем выстрел иначе ставим/убираем корабль
    if (this.state.isStarted) {
      player = this.state.isTurnOfPlayer1
        ? { ...this.state.player2 }
        : { ...this.state.player1 };
      if (!this.state.isMakeShot) {
        player.field.map((square) => {
          if (square.x === x && square.y === y && !square.content) {
            square.isContainShot = !square.isContainShot;
            shooting = true;
            lastShot = { x, y };
          }
          return square;
        });
      } else if (this.state.lastShot?.x === x && this.state.lastShot?.y === y) {
        player.field.map((square) => {
          if (square.x === x && square.y === y && !square.content)
            square.isContainShot = !square.isContainShot;
          return square;
        });
        shooting = false;
      }
      this.state.isTurnOfPlayer1
        ? this.setState({
            player2: player,
            isMakeShot: shooting,
            lastShot: lastShot,
          })
        : this.setState({
            player1: player,
            isMakeShot: shooting,
            lastShot: lastShot,
          });
    } else {
      player = this.state.isTurnOfPlayer1
        ? { ...this.state.player1 }
        : { ...this.state.player2 };
      player.field.map((square) => {
        if (square.x === x && square.y === y) {
          // находим выбранную клетку и устанавливаем в ней корабль или убираем, если корабль там уже стоит
          if (player.numberOfShips === 8 && square.isContainShip) {
            square.isContainShip = false;
            player.numberOfShips--;
            player.isInstalledShips = false;
          } else if (player.numberOfShips < 8) {
            player.numberOfShips = square.isContainShip
              ? player.numberOfShips - 1
              : player.numberOfShips + 1;
            square.isContainShip = !square.isContainShip;
          }
        }
        return square;
      });
      this.state.isTurnOfPlayer1
        ? this.setState({
            player1: player,
          })
        : this.setState({
            player2: player,
          });
    }
  };

  render(): ReactNode {
    return (
      <div className="game">
        <div className="game__action">
          {/* Кнопка для начала новой игры */}
          <Button text="Новая игра" onClick={this.newGame} />
        </div>
        {/* Отображение информации о текущем игроке */}
        <UserAction
          playerName={
            this.state.isTurnOfPlayer1
              ? this.state.player1.name
              : this.state.player2.name
          }
          actionInfo={this.state.actionInfo}
        >
          {!this.state.isReadyFields && (
            <Button
              text="Подтвердить"
              onClick={() => this.switchPlayer()}
              status={
                this.state.isTurnOfPlayer1
                  ? !this.state.player1.isInstalledShips
                  : !this.state.player2.isInstalledShips
              }
            />
          )}
          {this.state.isReadyFields && !this.state.isReadyPlayer && (
            <Button
              text="Начать ход"
              onClick={() => this.startGame()}
              status={!this.state.player1.isInstalledShips}
            />
          )}

          {this.state.isStarted &&
          !this.state.isWin &&
          this.state.isReadyPlayer &&
          !this.state.isFail ? (
            <Button
              text="Атаковать"
              onClick={() => this.confirmShot()}
              status={!this.state.isMakeShot}
            />
          ) : (
            ''
          )}

          {this.state.isStarted &&
          !this.state.isWin &&
          this.state.isReadyPlayer &&
          this.state.isFail ? (
            <Button
              text="Завершить ход"
              onClick={() => this.endTurn()}
              status={false}
            />
          ) : (
            ''
          )}
        </UserAction>
        <div className="game__field">
          {!this.state.isReadyFields ? (
            <Field
              field={
                this.state.isTurnOfPlayer1
                  ? this.state.player1.field
                  : this.state.player2.field
              }
              visible={true}
              action={this.handlerClick}
              playerName={
                this.state.isTurnOfPlayer1
                  ? this.state.player1.name
                  : this.state.player2.name
              }
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
                playerName={
                  this.state.isTurnOfPlayer1
                    ? this.state.player1.name
                    : this.state.player2.name
                }
              />
              <Field
                field={
                  this.state.isTurnOfPlayer1
                    ? this.state.player2.field
                    : this.state.player1.field
                }
                visible={false}
                action={this.handlerClick}
                playerName={
                  this.state.isTurnOfPlayer1
                    ? this.state.player2.name
                    : this.state.player1.name
                }
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
