#!/bin/bash

#0 puste pole, 1=kolko, 2=krzyzyk

maxRounds=9
currentPlayer=1
gameEnd=0

declare -A stateTable
rowInput=0
colInput=0

playerSymbols=("*" "X" "O")
winCons=(0 0 0)

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

    #while ! [[ ( $rowInput -ge 0 && $rowInput -le 2 && $colInput -ge 0 && $colInput -le 2 && stateTable[$rowInput,$colInput] -eq 0 ) || $rowInput -eq "X" || $colInput -eq "X" ]]
    echo "${stateTable[$rowInput,$colInput]}"
    while ! ( (($rowInput >= 0 && $rowInput <= 2 && $colInput >= 0 && $colInput <= 2 && stateTable[$rowInput,$colInput] == 0)) || [[ $rowInput == "X" ]] )
    do
        echo "Coordinates picked are out of range (0,2), pick again(X to exit):"
        echo "Pick row:"
        read rowInput
        echo "Pick column:"
        read colInput
    done
}

gameCycle () {

    echo "/////////////////////////"
    echo "${playerSymbols[$currentPlayer]}'s turn"
    echo ""

    printTable
    collectInput

    if [[ $rowInput == "X" ]] || [[ $colInput == "X" ]];
    then
        echo "exit"
        gameEnd=1
        return
    else
        stateTable[$rowInput,$colInput]=$currentPlayer

        printf "\n\n"

        if [[ $currentPlayer -eq 1 ]];
        then
            currentPlayer=2
        else
            currentPlayer=1
        fi
    fi

    

}

winCondition () {

    for playerVal in {1..2}
    do
        #vertical lines
        for i in {0..2}
        do
            if (( stateTable[$i,0] == $playerVal && stateTable[$i,1] == $playerVal && stateTable[$i,2] == $playerVal ));
            then
                echo "${playerSymbols[$currentPlayer]} Wins"
                gameEnd=1
                return 1
            fi
        done

        #horizontal lines
        for i in {0..2}
        do
            if (( stateTable[0,$i] == $playerVal && stateTable[1,$i] == $playerVal && stateTable[2,$i] == $playerVal ));
            then
                echo "${playerSymbols[$currentPlayer]} Wins"
                gameEnd=1
                return 1
            fi
        done

        #cross lines
        if (( stateTable[0,0] == $playerVal && stateTable[1,1] == $playerVal && stateTable[2,2] == $playerVal ));
        then
            echo "${playerSymbols[$currentPlayer]} Wins"
            gameEnd=1
            return 1
        fi

        if (( stateTable[0,2] == $playerVal && stateTable[1,1] == $playerVal && stateTable[2,1] == $playerVal ));
        then
            echo "${playerSymbols[$currentPlayer]} Wins"
            gameEnd=1
            return 1
        fi

    done

}

for round in {1..9}
do
    gameCycle
    winCondition
    if (( $gameEnd == 1 ))
    then
        printTable
        break
    fi
done



#read myname