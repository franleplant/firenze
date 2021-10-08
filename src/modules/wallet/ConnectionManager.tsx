//import { useWeb3React } from '@web3-react/core'
//import { useEffect } from 'react'

//import { injected } from "./connectors";
//import { useEagerConnect, useInactiveListener } from '../../hooks/web3'

//export default function ConnectionManager({ children }: { children: JSX.Element }) {
//const { active, error, activate } = useWeb3React()

//// try to eagerly connect to an injected provider, if it exists and has granted access already
//const triedEager = useEagerConnect()

//// after eagerly trying injected, if the network connect ever isn't active or in an error state, activate it
//useEffect(() => {
//if (triedEager && !active && !error) {
//activate(network)
//}
//}, [triedEager, active, error, activate])

//// if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
//if (triedEager && !active && error) {
//return (
//<MessageWrapper>
//<Message>
//<Trans>
//Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.
//</Trans>
//</Message>
//</MessageWrapper>
//)
//}

//return children
//}
//
// fake
//
export const fake = {};
