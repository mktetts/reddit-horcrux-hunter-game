import GameApp from './components/GameApp';
import ErrorBoundary from './components/ErrorBoundary';

export const App = () => {
  return (
    <ErrorBoundary>
      <GameApp />
    </ErrorBoundary>
  );
};
