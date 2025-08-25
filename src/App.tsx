import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HtmlToPdf from './pages/HtmlToPdf';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HtmlToPdf />} />
			</Routes>
		</Router>
	);
}

export default App;


