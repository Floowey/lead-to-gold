// import { Provider } from 'jotai';
import './App.css';
import { ResetButton } from './atoms/Reset';
import { BuildingList } from './components/BuildingList';
import { ResourceList } from './components/ResourceList';
import { useTick } from './hooks/useTick';
import useStore from './store/store'
function App() {

  const incAll = useStore((store) => store.incrementAllResourcesTick)
  const updateRes = useStore((store) => store.updateResources)
  useTick((dt) => {
    updateRes()
    incAll(dt)
  }
  )

  return (
    <div className="App">
      <ResourceList />
      <BuildingList />
      <br />
      <ResetButton />
    </div>
  );
}

export default App;

