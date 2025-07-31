import React, { useState } from 'react'
import './Home.css'
import Header from '../../component/Header/Header'
import ExploreMenu from '../../component/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../component/FoodDisplay/FoodDisplay'
import Ad from '../../component/Ad/Ad'

const Home = () => {

    const[ category,setCategory] = useState("All")
      // This is the Home component that renders the Header and ExploreMenu components
  return (
    <div>
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <Ad/>
    </div>
  )
}

export default Home
