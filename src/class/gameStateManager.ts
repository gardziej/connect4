import { BehaviorSubject } from "rxjs";
import GameState from "../enum/gameState";

class GameStateManager {
  public gameStateChanged$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(GameState.Init);

  public getCurrentGameState(): GameState {
    return this.gameStateChanged$.getValue();
  }
}

const gameStateManager: GameStateManager = new GameStateManager();
export default gameStateManager;