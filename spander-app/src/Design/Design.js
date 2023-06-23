import React from 'react';
import { Link } from 'react-router-dom';
import './Design.css';
import sd from '../assets/SpanderDesign.json';

const Design = () => (
    <>
        <div className='design'>
            <div className='top'>
                <div>(This is a reference page for UIDB development and instructions only, should not be displayed in the future)</div>
                <h1 style={{ marginTop: "25px" }}>Spander App</h1>
                <h2>Design: components and signatures</h2>
            </div>
            <center>
                <table>
                    <tr>
                        <th>#</th>
                        <th>Component Signature</th>
                        <th>Description</th>
                        <th>Path</th>
                    </tr>
                   {sd.comps_list.map((item,index) => (
                     <tr>
                        <td>{index+1}</td>
                        <td style={{color:item.highlight ? "yellow" : "white"}}>{item.name}</td>
                        <td>{item.desc}</td>
                        <td>{item.path ? item.path.map(path => <><Link to={path}>{path}</Link><br /></>) : "N/A"}</td>
                     </tr>
                   ))}
                </table>
                </center>
                {
                    sd.comps_list.map((item) => {
                        
                        if (item.methods) {
                           return (
                             <>
                               <br />
                               <br />
                               <h3 className="comp_title">{item.name.replace(".js","")}</h3>
                               <br />
                               <center>
                               <table>
                               <tr>
                                <th>#</th>
                                <th>Method/Function Signature</th>
                                <th>Description</th>
                                
                               </tr>
                                {
                                  item.methods.map((method,index) => (
                                    <tr>
                                    <td>{index+1}</td>
                                    <td style={{color:method.highlight ? "yellow" : "white"}}>{method.name}</td>
                                    <td>{method.desc}</td>
                                 </tr>
                                  ))
                                }
                               </table>
                               </center>
                             </>
                           )
                        }
                        /*
                        <tr>
                           <td>{index+1}</td>
                           <td style={{color:item.highlight ? "yellow" : "white"}}>{item.name}</td>
                           <td>{item.desc}</td>
                           <td>{item.path ? item.path.map(path => <><Link to={path}>{path}</Link><br /></>) : "N/A"}</td>
                        </tr>*/
                    })
                }
            
        </div>
       
    </>
);

export default Design;



