import { useState, useEffect } from 'react';
import Image from 'next/image';
import path from 'path';

const types = {
  0: "Wildtypes",
  1: "Single Recessive",
  2: "Double Trait",
  3: "Triple Trait",
  4: "Quad Trait",
  5: "Five Trait",
  6: "Six Trait",
  7: "Singe Dominant",
  8: "Selectively Bred",
};

const TYPE_MAP = {
    "Wildtypes": 0,
    "Single Recessive": 1,
    "Double Trait": 2,
    "Triple Trait": 3,
    "Quad Trait": 4,
    "Five Trait": 5,
    "Six Trait": 6,
    "Single Dominant": 7,
    "Single Incomplete Dominant": 7,
    "Selectively Bred": 8
}

const traits = {
  wildtype: ['Alabama', 'Keys', 'Miami', 'Normal', 'Okeetee'],
  recessive: [
    'Lavender', 'Microscale', 'Motley', 'Red Coat', 'Scaleless', 'Strawberry', 'Stripe', 'Sunkissed', 'Sunrise', 'Terrazzo', 'Ultra', 'Amelanistic', 'Anerythristic', 'Caramel', 'Charcoal', 'Christmas', 'Cinder', 'Diffused', 'Dilute', 'Hypomelanistic', 'Kastanie', 'Lava',
  ],
  dominant: ['Het Palmetto', 'Palmetto', 'Buf', 'Masque', 'Tessera'],
};

const Morphs = () => {

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTraits, setSelectedTraits] = useState([]);

  const [morphs, setMorphs] = useState([]);
  const [expandedMorphs, setExpandedMorphs] = useState({});

  useEffect(() => {
    const fetchInitialMorphs = async () => {
      const response = await fetch('/api/morphs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ types: [], traits: [] }),
      });

      const data = await response.json();
      setMorphs(data);
    };

    fetchInitialMorphs();
  }, []);


  const handleTypeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedTypes((prevSelectedTypes) =>
      checked
        ? [...prevSelectedTypes, value]
        : prevSelectedTypes.filter((type) => type !== value)
    );
  };

  const handleTraitChange = (event) => {
    const { value, checked } = event.target;
    setSelectedTraits((prevSelectedTraits) =>
      checked
        ? [...prevSelectedTraits, value]
        : prevSelectedTraits.filter((trait) => trait !== value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log({ selectedTypes, selectedTraits });
    try {
      const response = await fetch('/api/morphs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ types: selectedTypes, traits: selectedTraits }),
      });
      const data = await response.json();
      setMorphs(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const fetchImages = async (hatchlingImg, adultImg) => {
    let hatchlingUrl;
    let adultUrl;

    if (hatchlingImg) {
        const hatchlingResponse = await fetch(`/api/pics/${hatchlingImg}`);
        const hatchlingBlob = await hatchlingResponse.blob();
        hatchlingUrl = URL.createObjectURL(hatchlingBlob);
    }
    if (adultImg) {
        const adultResponse = await fetch(`/api/pics/${adultImg}`);
        const adultBlob = await adultResponse.blob();
        adultUrl = URL.createObjectURL(adultBlob);
    }
    return { hatchlingUrl, adultUrl };
  };


  const toggleMorph = async (id, hatchlingImg, adultImg) => {
    if (!expandedMorphs[id]) {
        const { hatchlingUrl, adultUrl } = await fetchImages(hatchlingImg, adultImg);
        setExpandedMorphs((prevExpandedMorphs) => ({
          ...prevExpandedMorphs,
          [id]: { hatchlingUrl, adultUrl },
        }));
      } else {
        setExpandedMorphs((prevExpandedMorphs) => {
          const newExpandedMorphs = { ...prevExpandedMorphs };
          delete newExpandedMorphs[id];
          return newExpandedMorphs;
        });
      }
  };

  return (
    <div className='morph-container'>
    <div className='morph-filter'>
    <form onSubmit={handleSubmit}>
      <h3>Type Filter</h3>
      {Object.entries(TYPE_MAP).map(([key, value]) => (
        <div key={key}>
          <input
            type="checkbox"
            id={`type-${key}`}
            value={value}
            onChange={handleTypeChange}
          />
          <label htmlFor={`type-${key}`}>{key}</label>
        </div>
      ))}

      <h3>Trait Filter</h3>
      {Object.entries(traits).map(([category, categoryTraits]) => (
        <div key={category}>
          <h4>{category}</h4>
          {categoryTraits.map((trait) => (
            <div key={trait}>
              <input
                type="checkbox"
                id={`trait-${trait}`}
                value={trait}
                onChange={handleTraitChange}
              />
              <label htmlFor={`trait-${trait}`}>{trait}</label>
            </div>
          ))}
        </div>  
        ))}
        <button type="submit">Apply Filter</button>
    </form>
    </div>
    <div className='morph-list'>
    <ul >
        {morphs.map((morph) => (
          <li key={morph._id} onClick={() => toggleMorph(morph._id, morph.hatchlingImg, morph.adultImg)}  className='morph-row'>
            <div>
              <strong>{morph.name}</strong>
              <p>Traits: {morph.traits.join(', ')}</p>
              <Image src={path.join("/img", morph.thumbnail)} alt="thumbnail" width={40} height={40}></Image>
              <input type='checkbox'></input>
            </div>
            {expandedMorphs[morph._id] && (
              <>
              <div className='image-container'>
                { morph.hatchlingImg ? (
                    <Image className='img' src={expandedMorphs[morph._id].hatchlingUrl} width={500} height={500} alt="Hatchling" />
                ) : (
                    <div className='no-pic'>Hatchling image not available</div>
                )}
                </div>
                <div className='image-container'>
                { morph.adultImg ? (
                    <Image className='img' src={expandedMorphs[morph._id].adultUrl}  width={500} height={500} alt="Adult" />
                ) : (
                    <div className='no-pic'>Adult image not available</div>
                )}
              </div>
              </>
            )}
          </li>
        ))}
      </ul>
      </div>

      </div>
  )
};

export default Morphs;
