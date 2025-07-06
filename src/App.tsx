import Calculator from './components/Calculator';

export default function App() {
  return (
    <>
      <header style={{ textAlign: 'center', margin: '1rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
        MR Calculator
      </header>

      <main style={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100vh - 4rem)' }}>
        <Calculator />
      </main>
    </>
  );
}
