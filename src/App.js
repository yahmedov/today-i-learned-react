import { useState } from 'react';
import './style.css';

const CATEGORIES = [
  { name: 'technology', color: '#3b82f6' },
  { name: 'science', color: '#16a34a' },
  { name: 'finance', color: '#ef4444' },
  { name: 'society', color: '#eab308' },
  { name: 'entertainment', color: '#db2777' },
  { name: 'health', color: '#14b8a6' },
  { name: 'history', color: '#f97316' },
  { name: 'news', color: '#8b5cf6' },
];

const initialFacts = [
  {
    id: 1,
    text: 'React is being developed by Meta (formerly facebook)',
    source: 'https://opensource.fb.com/',
    category: 'technology',
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: 'Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%',
    source:
      'https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids',
    category: 'society',
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: 'Lisbon is the capital of Portugal',
    source: 'https://en.wikipedia.org/wiki/Lisbon',
    category: 'society',
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

// // useState example
// function Counter() {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <span style={{ fontSize: '40px' }}>{count}</span>
//       <button
//         className='btn btn-large'
//         onClick={() => setCount((c) => c + 1)}
//       >
//         +1
//       </button>
//     </div>
//   );
// }

function App() {
  // 1. define state
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {/* Pass state as props */}
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* 2. use state variable */}
      {showForm ? <NewFactForm /> : null}

      <main className='main'>
        <CategoryFilter />
        <FactList />
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  const appTitle = 'Today I Learned';
  return (
    <header className='header'>
      <div className='logo'>
        <img src='logo.png' height='68' width='68' alt='Today I Learned Logo' />
        <h1>{appTitle}</h1>
      </div>

      <button
        className='btn btn-large btn-open'
        // 3. update state variable
        onClick={() => setShowForm(show => !show)}
      >
        {showForm ? 'close' : 'Share a fact'}
      </button>
    </header>
  );
}

function NewFactForm() {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    console.log(text, source, category)
  }

  return (
    <form className='fact-form' onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={event => setText(event.target.value)}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={event => setSource(event.target.value)}
      />
      <select
        value={category}
        onChange={event => setCategory(event.target.value)}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map(cat => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large">Post</button>
    </form>)
}

function CategoryFilter() {
  return (
    <aside>
      <ul className='category'>
        <li>
          <button className='btn btn-all-categories'>All</button>
        </li>
        {CATEGORIES.map(cat => (
          <li key={cat.name} className='category'>
            <button
              className='btn btn-category'
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList() {
  // TEMP
  const facts = initialFacts;

  return (
    <section>
      <ul className='facts-list'>
        {facts.map(fact => (
          <Fact fact={fact} key={fact.id} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section >
  );
}

function Fact({ fact }) {
  return (
    <li className='fact'>
      <p>
        {fact.text}
        <a className='source' href={fact.source} target='_blank' rel='noreferrer'>(Source)</a>
      </p>
      <span className='tag' style={{ backgroundColor: CATEGORIES.find(cat => cat.name === fact.category).color }}>{fact.category}</span>
      <div className='vote-buttons'>
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
