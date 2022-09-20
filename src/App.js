import logo from './logo.svg';
import './App.css';
import { DatePickerComponent } from './datePicker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* What inputs do I need to pass here?  */}
        <DatePickerComponent isToggleOn={true}   />
      </header>
    </div>
  );
}

export default App;