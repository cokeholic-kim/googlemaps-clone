import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Skeleton,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import { GoogleMap, useJsApiLoader ,Marker , Autocomplete ,DirectionsRenderer} from '@react-google-maps/api'
import { useState,useRef } from 'react'
const center = {lat:1.3141707, lng:103.7742106} // 지도의 시작위치 ,, 프로젝트에서는 이것도 데이터베이스에서 받아와야함

function App() {
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries:['places'], //autocomplete될 항목,
  })

  const[map,setMap]=useState(/**@type google.maps.Map*/(null)) //google map 상태관리. , @type을 써줘야 panTo 사용가능
  const[directionsResponse,setdirectionsResponse] = useState(null)
  const[distance,setDistance] = useState('') //거리 상태값
  const[duration,setDuration] = useState('') //소요시간상태값

  /**@type React.MutableRefobject<HTMLInputElement>*/ 
  const originRef = useRef()
  /**@type React.MutableRefobject<HTMLInputElement>*/ 
  const destinationRef = useRef()

  if(!isLoaded){
    return <SkeletonText/>
  }

  async function calculateRoute() {
    if(originRef.current.value === '' || destinationRef.current.value === ''){
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const result = await directionsService.route({
      origin:originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.WALKING
    })
    setdirectionsResponse(result)
    setDistance(result.routes[0].legs[0].distance.text)
    setDuration(result.routes[0].legs[0].duration.text)
  }

  function clearRoute(){ //  인풋값들을 초기화
    setdirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  console.log(map)
  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap center={center}
        zoom={13}
        mapContainerStyle={{width:"100%",height:"100%"}}
        options={{
          zoomControl:false,
          streetViewControl:false,
          mapTypeControl:false,
          fullscreenControl:false,
        }}
        onLoad={(map) => setMap(map)} 
        >
          {/*on load = 로딩되면 map을 콜백해줌*/}
          <Marker position={center} label="Singapore"  icon={"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"} />  position값만 들어가면 마크를 찍을 수있다. 
          {directionsResponse && <DirectionsRenderer directions={directionsResponse}/>} 
          {/* displayng markers,directions*/}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={4}>
          {/* 구글 자동완성 인풋값에넣어주기 */}

          <Autocomplete>
            <Input type='text' placeholder='Origin' ref={originRef}/>
          </Autocomplete>
    
          <Autocomplete>
            <Input type='text' placeholder='Destination' ref={destinationRef}/>
          </Autocomplete>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration}</Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)} 
          />
          {/* panTo=(center) center위치로 이동 */}
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
