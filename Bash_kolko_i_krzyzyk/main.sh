#!/bin/bash

#0 puste pole, 1=kolko, 2=krzyzyk

maxRounds=9
currentPlayer=1

declare -A stateTable
rowInput=0
colInput=0

playerSymbols=("*" "X" "O")

for i in {0..2}
do
    for j in {0..2}
    do
        stateTable[$i,$j]=0
    done
done

printTable () {

    printf "\t0\t1\t2\n\n"
    for i in {0..2}
    do
        printf "${i}\t"
        for j in {0..2}
        do
            #playerID=${stateTable[$i,$j]}
            #playerSymbol=${playerSymbols[${stateTable[$i,$j]}]}
            printf "${playerSymbols[${stateTable[$i,$j]}]}\t"
        done
        printf "\n\n"
    done
}

collectInput () {
    rowInput=0
    colInput=0

    echo "Pick row:"
    read rowInput
    echo "Pick column:"
    read colInput

    while ! [[ $rowInput -ge 0 && $rowInput -le 2 && $colInput -ge 0 && $colInput -le 2 && stateTable[$rowInput,$colInput] -eq 0 ]]
    do
        echo "Coordinates picked are out of range (1,3), pick again:"
        echo "Pick row:"
        read rowInput
        echo "Pick column:"
        read colInput
    done
}

saveGame

gameCycle () {

    echo "/////////////////////////"
    echo "${playerSymbols[$currentPlayer]}'s turn"
    echo ""

    printTable
    collectInput

    stateTable[$rowInput,$colInput]=$currentPlayer

    printf "\n\n"

    if [[ $currentPlayer -eq 1 ]]
    then
        currentPlayer=2
    else
        currentPlayer=1
    fi

}

for round in {1..9}
do
    gameCycle
done



#read myname