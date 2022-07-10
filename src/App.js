import React, { useEffect, useState, useRef } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { connect } from './redux/blockchain/blockchainActions'
import { fetchData } from './redux/data/dataActions'
import * as s from './styles/globalStyles'
import styled from 'styled-components'
import { create } from 'ipfs-http-client'

export const StyledButton = styled.button`
  padding: 8px;
`

function App() {
  const [totalMinted, setTotalMinted] = useState(0)
  const dispatch = useDispatch()
  const blockchain = useSelector((state) => state.blockchain)
  const data = useSelector((state) => state.data)
  const [feedback, setfeedback] = useState('Maybe it is your lucky day.')
  const [harvestingNft, setHarvestingNft] = useState(false)

  const harvest = () => {
    setHarvestingNft(true)
    blockchain.smartContract.methods
      .withdraw()
      .send({
        from: blockchain.account,
      })
      .once('error', (err) => {
        console.log(err)
        setfeedback('Error occured')
        setHarvestingNft(false)
      })
      .then((receipt) => {
        console.log('success')
        setfeedback('Withdraw successed')

        setHarvestingNft(false)
      })
    //setHarvestingNft(false)
  }

  useEffect(() => {
    if (blockchain.account !== '' && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account))
      const getTotalMinted = async () => {
        const totalMinted = await blockchain.smartContract.methods
          .totalSupply()
          .call()
        return totalMinted
      }
      const init = async () => {
        setTotalMinted(await getTotalMinted())
      }

      init()
    }
  }, [blockchain.smartContract, dispatch])

  return (
    <s.Screen>
      {blockchain.account === '' || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={'center'} jc={'center'}>
          <s.TextTitle>Connect to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
          <StyledButton
            onClick={(e) => {
              e.preventDefault()
              dispatch(connect())
            }}
          >
            CONNECT
          </StyledButton>
          <s.SpacerSmall />
          {blockchain.errorMsg !== '' ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container
          flex={1}
          ai={'center'}
          jc={'center'}
          style={{ padding: 24, backgroundColor: 'pink' }}
        >
          <s.TextTitle style={{ textAlign: 'center' }}>
            Project Name: {data.name}.
          </s.TextTitle>
          <s.SpacerSmall />
          <s.TextDescription style={{ textAlign: 'center' }}>
            {feedback}
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextTitle style={{ textAlign: 'center' }}>
            {totalMinted} / 20
          </s.TextTitle>
          <s.SpacerSmall />
          <StyledButton
            disabled={harvestingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault()
              harvest()
            }}
          >
            {harvestingNft ? 'Busy' : 'Harvest'}
          </StyledButton>
          <s.SpacerSmall />
        </s.Container>
      )}
    </s.Screen>
  )
}

export default App
