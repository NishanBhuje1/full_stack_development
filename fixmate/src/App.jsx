import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Commitment from './components/Commitment';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Commitment />
      </main>
      <Footer />
    </div>
  );
}

export default App;
