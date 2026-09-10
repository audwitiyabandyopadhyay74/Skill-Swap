import React from 'react'
import Navbar from './components/Navbar'
import Banner from "./components/Banner"
import MasterTheSkillOfHelping from "./components/MasterTheSkillOfHelping"
import Steps from "./components/Steps"
import WhyUs from "./components/Why Us"
import LetsMakeIt from "./components/Lets Make it"
import Footer from "./components/Footer"

const page = () => {
  return (
    <>
    <Navbar/>
    <Banner/>
    <MasterTheSkillOfHelping/>
    <Steps/>
    <WhyUs/>
    <LetsMakeIt/>
    <Footer/>
    </>
  )
}

export default page
