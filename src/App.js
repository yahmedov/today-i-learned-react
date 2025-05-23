import { useEffect, useState } from 'react';
import supabase from './supabase';

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

function App() {
  // 1. define state
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(function () {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.from('facts').select('*');
      if (currentCategory !== 'all') {
        query.eq('category', currentCategory); // filter by column value
      }

      const { data: facts, error } = await query
        .order('votesInteresting', { ascending: false })
        .limit(100);

      if (!error) {
        setFacts(facts);
      } else {
        alert('There was an error fetching data!');
      }

      setIsLoading(false);
    }

    getFacts();
  }, [currentCategory]); // re-triger effect whenever currentCategory changes

  return (
    <>
      {/* Pass state as props */}
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* 2. use state variable */}
      {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm} /> : null}

      <main className='main'>
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} />}
      </main>
    </>
  );
}

function Loader() {
  return (
    <p className='message'>Loading ...</p>
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

function isValidHttpUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Checks if url starts with either http or https
 * if not prepends https:// before the url
 * @param {string} url 
 * @param {string} protocol https
 * @returns {string} url ready to use as href
 * @example
 * ensureLinkProtocol('http://www.example.com')
 * 'http://www.example.com' // same as input
 * ensureLinkProtocol('www.example.com')
 * 'https://www.example.com' // prepended url
 */
function ensureLinkProtocol(url, protocol = 'https') {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  } else {
    return `${protocol}://${url}`;
  }
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(event) {
    // 1. Prevent browser reload
    event.preventDefault();
    console.log(text, source, category)

    // 2. check if data is valid
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      // 3. upload the new fact to Supabase DB
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from('facts')
        .insert([{ text, source, category }])
        .select();

      setIsUploading(false);

      // 4. add the new fact to the UI
      if (!error) {
        setFacts(facts => [newFact[0], ...facts]);
      } else {
        alert('Error uploading fact.');
      }

      // 5. reset input fields
      setText('');
      setSource('');
      setCategory('');

      // 6. close the form
      setShowForm(false);
    } else if (!isValidHttpUrl(source)) {
      alert('enter valid url in format "https://example.com"');
    }
  }

  return (
    <form className='fact-form' onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={event => setText(event.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={event => setSource(event.target.value)}
        // EXAMPLE usage - automatically add https if no protocol was specified
        onBlur={() => setSource(ensureLinkProtocol(source))} // on focus change, https the source
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={event => setCategory(event.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map(cat => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>Post</button>
    </form>)
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul className='category'>
        <li>
          <button
            className='btn btn-all-categories'
            onClick={() => setCurrentCategory('all')}
          >All</button>
        </li>
        {CATEGORIES.map(cat => (
          <li key={cat.name} className='category'>
            <button
              className='btn btn-category'
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return <p className='message'>No facts for this category yet! Create the first one ✌️</p>
  }
  return (
    <section>
      <ul className='facts-list'>
        {facts.map(fact => (
          <Fact fact={fact} setFacts={setFacts} key={fact.id} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section >
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = (fact.votesInteresting + fact.votesMindblowing) < fact.votesFalse;
  async function handleVote(columnName) {
    setIsUpdating(true);

    const { data: updatedFact, error } = await supabase
      .from('facts')
      .update({ [columnName]: fact[columnName] + 1 })
      .eq('id', fact.id)
      .select()

    setIsUpdating(false);

    if (!error) {
      setFacts(facts => facts.map(f => (f.id === fact.id ? updatedFact[0] : f)));
    }
  }
  return (
    <li className='fact'>
      <p>
        {isDisputed ? <span className='disputed'>[⛔️ DISPUTED]</span> : null}
        {fact.text}
        <a className='source' href={fact.source} target='_blank' rel='noreferrer'>(Source)</a>
      </p>
      <span className='tag' style={{ backgroundColor: CATEGORIES.find(cat => cat.name === fact.category).color }}>{fact.category}</span>
      <div className='vote-buttons'>
        <button onClick={() => handleVote('votesInteresting')} disabled={isUpdating}>👍 {fact.votesInteresting}</button>
        <button onClick={() => handleVote('votesMindblowing')} disabled={isUpdating}>🤯 {fact.votesMindblowing}</button>
        <button onClick={() => handleVote('votesFalse')} disabled={isUpdating}>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
