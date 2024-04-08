import { useState, useRef, useEffect } from 'react';
import trash from './assets/images/delete.svg';
import update from './assets/images/update.svg';
import uzLang from './assets/lang/uz.json';
import enLang from './assets/lang/en.json';
import ruLang from './assets/lang/ru.json';

interface Item {
  item: string;
  category: string;
}

interface InputProps {
  onAdd: (newItem: string, category: string) => void;
  selectedCategory: string;
  lang: any;
  categoryOptions: string[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

function Input({ onAdd, selectedCategory, lang, categoryOptions, setSelectedCategory }: InputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    const newItem = (inputRef.current?.value || '').trim();
    if (newItem !== "") {
      onAdd(newItem, selectedCategory);
      inputRef.current!.value = "";
    } else {
      alert(lang.emptyFieldError);
    }
  }

  return (
    <>
      <div className="container">
        <input ref={inputRef} className='input' type="text" maxLength={55} placeholder={`${lang.inputPlaceholder}`} />
        <select className='categorySelected' onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          {categoryOptions.map((category: string, index: number) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <button className='add' onClick={handleClick}>{lang.addButton}</button>
      </div>
    </>
  );
}

function App(): JSX.Element {
  const categoryOptions = ["All", "Groceries", "College", "Payments"];
  const [data, setData] = useState<Item[]>(() => {
    const storedData = localStorage.getItem('data');
    return storedData ? JSON.parse(storedData) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lang, setLang] = useState<any>(enLang);

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  function handleAdd(newItem: string, category: string) {
    const isDuplicate = data.some(item => item.item === newItem && item.category === category);

    if (isDuplicate) {
      alert(lang.duplicateError);
      return;
    }

    setData(prevData => [...prevData, { item: newItem, category: category }]);
  }

  function handleDelete(index: number) {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  }

  function handleUpdate(index: number, newItem: string, category: string) {
    const newData = [...data];
    newData[index] = { item: newItem, category: category };
    setData(newData);
  }

  return (
    <>
      <div className="container">
        <div className="languagesButtons">
          <button className='languageBtn' onClick={() => setLang(ruLang)}>Руский</button>
          <button className='languageBtn' onClick={() => setLang(enLang)}>English</button>
          <button className='languageBtn' onClick={() => setLang(uzLang)}>O'zbekcha</button>
      </div>
        <div className="categoryMenu">
          <div className="categoryTexts">
            <h2 className='category' onClick={() => setSelectedCategory("All")}>{lang.all}</h2>
            <h2 className='category' onClick={() => setSelectedCategory("Groceries")}>{lang.groceries}</h2>
            <h2 className='category' onClick={() => setSelectedCategory("College")}>{lang.college}</h2>
            <h2 className='category' onClick={() => setSelectedCategory("Payments")}>{lang.payments}</h2>
          </div>
        </div>

        <div className="main">
          <h1 className='allTasks'>{lang.allTasks}</h1>
          <Input onAdd={handleAdd} selectedCategory={selectedCategory} lang={lang} categoryOptions={categoryOptions} setSelectedCategory={setSelectedCategory} />
          <ul>
            {data.map((el, index) => {
              if (selectedCategory === "All" || el.category === selectedCategory) {
                return (
                  <li key={index}>
                    {el.item}
                    <span className='categoryInfo'>{el.category}</span>
                    <img className='delete' src={trash} alt="delete" onClick={() => handleDelete(index)} />
                    <button className='update' onClick={() => handleUpdate(index, prompt(lang.updatePrompt, el.item) || el.item, el.category)}><img className='imgUpdate' src={update} /></button>
                  </li>
                )
              } else {
                return null;
              }
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
