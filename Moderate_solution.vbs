Sub moderate()
    
    numRow = Cells(Rows.Count, "A").End(xlUp).Row
    Row = 0
    vol = 0
    openPrice = 0
    closePrice = 0
    For i = 1 To numRow
        If Cells(i, 1) = Cells(i + 1, 1) Then
            vol = vol + Cells(i + 1, 7)
        Else
            Row = Row + 1
            Cells(Row + 1, 9) = Cells(i + 1, 1)
            vol = vol + Cells(i + 1, 7)
            Cells(Row, 12) = vol
            vol = 0
            openPrice = openPrice + Cells(i + 1, 3)
            Cells(Row + 1, 13) = openPrice
            openPrice = 0
            If i > 1 Then
                closePrice = closePrice + Cells(i, 6)
                Cells(Row, 14) = closePrice
                closePrice = 0
            End If
        End If
    Next i
    
    Range("I1") = "Ticker"
    Range("J1") = "Yearly Change"
    Range("K1") = "Percent Change"
    Range("L1") = "Total Stock Volume"
    
    Cells(Row + 1, 13).ClearContents
    
    For i = 2 To Row
        Cells(i, 11) = Cells(i, 14) / Cells(i, 13) - 1
        Cells(i, 10) = Cells(i, 14) - Cells(i, 13)
        If Cells(i, 10) > 0 Then
            Cells(i, 10).Interior.ColorIndex = 4
        ElseIf Cells(i, 10) < 0 Then
            Cells(i, 10).Interior.ColorIndex = 3
        End If
    Next i
    
    Range("M:N").Delete
    
End Sub

