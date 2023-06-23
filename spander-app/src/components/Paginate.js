import React, { useEffect, useState } from "react";
import { Form, Pagination } from "react-bootstrap";
import converter from 'number-to-words'

const Paginate = ({ reposPerPage, totalRepos, currentPage,  paginate = () => { } }) => {

    const [pageNumbers, setPageNumbers] = useState([]);
    const [currPage, setCurrPage] = useState(1)
    const [totalRepository, setTotalRepos] = useState(0);


    useEffect(() => {
        setTotalRepos(totalRepos)

        const pageNum = []
        for (let i = 1; i <= Math.ceil(totalRepos / reposPerPage); i++) {
            pageNum.push(i)
        }
        setPageNumbers(pageNum)

    }, [reposPerPage, totalRepos])

    const handleTextChange = (e) => {
        const value = e.target.value;
        if (isNaN(value) && value > pageNumbers?.length && value < 1) {
            return false
        }
        if (value != '') {
            setCurrPage(value);
            paginate(value);
        } else {
            setCurrPage();
            paginate(currPage);
        }

    }

    return (
        <>
            <Pagination>
                <span className="total"> Total {totalRepository} items</span>

                <Pagination.Prev className="part_left" disabled={(currPage - 1 >= 1) ? false : true} onClick={() => {

                    if (currPage - 1 >= 1) {
                        setCurrPage(currPage - 1); paginate(currPage - 1)
                    } else {
                        setCurrPage(currPage); paginate(currPage)
                    }
                }} />
                {pageNumbers.map((num) => {
                    return (<Pagination.Item active={currentPage == num} onClick={() => { setCurrPage(num); paginate(num) }}> {num} </Pagination.Item>)
                })}
                <Pagination.Next className="part_right" disabled={(currPage < pageNumbers?.length) ? false : true} onClick={() => {
                    if (currPage < pageNumbers?.length) {
                        setCurrPage(currPage + 1); paginate(currPage + 1)
                    } else {
                        setCurrPage(currPage); paginate(currPage)
                    }
                }} />

                <div className="perPage">
                    <Form.Select aria-label="Default select example" onChange={(e) => {
                        setCurrPage(e.target.value);
                        paginate(e.target.value)
                    }} value={currPage}>
                        {pageNumbers?.map(num => (
                            <option value={num}>{`${num} / page`}</option>
                        ))}
                    </Form.Select>
                </div>

                <div className="goto_Box">
                    <span className="goto_text"> Go to</span>
                    <Form.Control
                        type="number"
                        className="goto"
                        value={currPage}
                        onChange={handleTextChange}
                        min={1}
                        max={pageNumbers?.length}
                    />
                </div>
            </Pagination>
        </>
    )
}

export default Paginate