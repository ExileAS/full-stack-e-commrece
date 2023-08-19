import { useState } from "react";
import { ProductExcerpt } from "../products/ProductList";
import { useSelector } from "react-redux";
import { selectAllInCart } from "../shoppingCart/shoppingCartSlice";

const SearchBar = ({data}) => {
    const categories = {
        devices : ['PC', 'phone', 'camera', 'hard drive'],
        clothes : ['t-shirt', 'shirt', 'troussers', 'skirt', 'dress'],
        accessories : ['keyboard', 'mouse', 'headphones', 'cooling pad', 'cooling paste', 'usb hub', 'mouse pad']
    };

    const [search, setSearch] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [categoryResults, setCategoryResults] = useState('');
    const productsInCart = useSelector(selectAllInCart);

    const others = data.filter(item => (
        Object.keys(categories).every(key => !categories[key].includes(item.type))
    ));

    const dataInCategory = searchCategory !== 'others' ? data.filter(item => (searchCategory === '' || categories[searchCategory].includes(item.type))) : others;

    const filterdData = dataInCategory.filter(item => search !== '' && item.name.toLowerCase().includes(search.toLowerCase()))
        .filter(product => !productsInCart.includes(product))
        .map(item => <ProductExcerpt product={item} key={item.id}/>);


    const handleSearch = e => setSearch(e.target.value);
    

    let searchResult = '';
    if(search.length > 0) {
        searchResult = filterdData.length === 0 ? 
         <h2>No Matching Results</h2> :
        <div>
            <h2>Search Results:</h2>
            {filterdData}
        </div>
    }

    
    const handleChangeCategory = e => {
        const category = e.target.value;
        setSearchCategory(category);
        const result = data.filter(item => categories[category] && categories[category].includes(item.type));
        const content = result.map(item => <ProductExcerpt product={item} key={item.id}/>);
        const otherContent = others.map(item => <ProductExcerpt product={item} key={item.id}/>);
        setCategoryResults(prev => (category === 'others' ? otherContent : content));
    }

                
    return ( 
    <div className="search-bar">
        <label>Search Products:</label>
        <br />
        <textarea name="search-bar" id="search-bar"
        value={search} 
        onChange={handleSearch}
        className="search-box"
        ></textarea> 
        <select 
        className="search-categories" onChange={handleChangeCategory}>
            <option value="" key=''></option>
            <option value="devices" key='devices'>devices</option>
            <option value="clothes" key='clothes'>clothes</option>
            <option value="accessories" key='accessories'>accessories</option>
            <option value="others" key='others'>others</option>
        </select>
        <div>
            {searchResult}
        </div>
        <div>
            {
            (search.length === 0 && searchCategory.length > 0) && 
            <div>
               <h2 className="category-name">{searchCategory}:</h2>
                {categoryResults}
            </div>
            }
        </div>
    </div>
    );
}
 
export default SearchBar;