'use client'

import { useEffect, useState, useRef } from 'react'
import words from "../data/words"

export default function Typing() {
    // Initialize state


    const [totalWords, setTotalWords] = useState(words.length);
    const [completedWords, setCompletedWords] = useState(0);
    const [nextWord, setNextWord] = useState('');
    const [currentWord, setCurrentWord] = useState([]);
    const [leftPoint, setLeftPoint] = useState([]);
    const [typeDone, setTypeDone] = useState(false);
    const [rightKeyCount, setRightKeyCount] = useState(0)
    const [errorKeyCount, setErrorKeyCount] = useState(0)
    const [wpm, setWpm] = useState(0)
    const refs = useRef([]);

    useEffect(() => {
        console.log('ddddddddddddddddddddd')
        let word = []
        let wordIndex = 0;
        let currentWordIndex = 0;
        let pointLeft = 0;
        let keyCount = 0;
        let initialFlag = true
        let startTime = 0
        let endTime = 0
        let rightKey = 0
        let errorKey = 0
        const init = () => {
            word = []
            wordIndex = 0;
            pointLeft = 0;

            for (let i = 0; i < words[currentWordIndex].length; i++) {
                word.push({ 'text': words[currentWordIndex][i], 'class': '' })
            }
            setCurrentWord([...word]);
            setLeftPoint(pointLeft)
            if (currentWordIndex == words.length)
                setNextWord('')
            else
                setNextWord(words[currentWordIndex + 1])
        }
        const restart = () => {
            currentWordIndex = 0;
            errorKey = 0
            initialFlag = true
            setRightKeyCount(0)
            setErrorKeyCount(0)
            setWpm(0)
            setCompletedWords(0)
            init()
        }
        if (!typeDone) restart()

        const handleGlobalKeyPress = (event) => {
            if (typeDone) return false

            if (initialFlag) {
                initialFlag = false
                startTime = new Date().getTime()
            }
            if (event.key.startsWith('F') && !isNaN(event.key.slice(1))) {
                return false;
            }
            if (event.shiftKey && event.key == 'Shift') {
                return false
            }
            // if (!word[wordIndex]) {
            //     restart()
            // }
            if (word[wordIndex].text === event.key) {
                word[wordIndex].class = "text-green-500"
                rightKey++
                setRightKeyCount(rightKey)
            }
            else {
                word[wordIndex].class = "text-red-500"
                errorKey++
                setErrorKeyCount(errorKey)
            }
            setCurrentWord([...word]);
            pointLeft += refs.current[wordIndex].getBoundingClientRect().width
            setLeftPoint(pointLeft)
            wordIndex++;
            if (wordIndex == words[currentWordIndex].length) {
                currentWordIndex++
                endTime = new Date().getTime()
                setCompletedWords(currentWordIndex)
                setWpm(Math.round(currentWordIndex * 60000 / (endTime - startTime)))
                if (currentWordIndex == words.length) {
                    setTypeDone(true)
                }
                else init();
            }
        }

        window.addEventListener('keydown', handleGlobalKeyPress);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyPress);
        };
    }, [typeDone])
    // Function to increment the count
    return (
        <>
            <div className={`${typeDone ? 'hidden' : ''} typing-section relative self-start`} >
                <div className='status mb-8 text-2xl flex text-yellow-600' >
                    <div className='total-words-number pr-2'>
                        {completedWords}</div>
                    <div className='pr-2'>/</div>
                    <div className='complete-word-number'>
                        {totalWords}
                    </div>
                </div>
                <div id="caret" className="w-0.5 h-8 bg-orange-500 absolute" style={{ left: leftPoint }}></div>
                <div className='flex text-3xl'>
                    {currentWord.map((txt, index) => {
                        return (
                            <div
                                className={txt.class}
                                key={index}
                                ref={(el) => (refs.current[index] = el)}
                            >
                                {txt.text}
                            </div>
                        )
                    })
                    }
                </div>
                <div className='next-word mt-2 text-2xl text-gray-600'>
                    {nextWord}
                </div>
            </div>
            <button
                className={`${typeDone ? '' : 'hidden'} cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]`}
                onClick={() => setTypeDone(false)}
            >
                Restart
            </button>
            <div className={'analysis-section text-gray-600 mt-10'} >
                <div className='flex justify-between' >
                    <p className='text-bold '>WPM (Word Per Minute) :</p>
                    <p className='text-green-400'>{wpm}</p>
                </div>
                <div className='flex justify-between'>
                    <p className='text-bold '>Right key: </p>
                    <p className='text-green-400'>{rightKeyCount}</p>
                </div>
                <div className='flex justify-between'>
                    <p className='text-bold '>Error key: </p>
                    <p className='text-red-400'>{errorKeyCount}</p>
                </div>
                <div className='flex justify-between'>
                    <p className='text-bold '>Accuracy: </p>
                    <p className='text-green-400'>{(rightKeyCount + errorKeyCount) == 0 ? 0 : Math.round(rightKeyCount*1000 / (rightKeyCount + errorKeyCount))/10}%</p>
                </div>
                
            </div>
        </>
    );
}