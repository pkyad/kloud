from reportlab import *
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors, utils
from reportlab.platypus import Paragraph, Table, TableStyle, Image, Frame, Spacer, PageBreak, BaseDocTemplate, PageTemplate, SimpleDocTemplate, Flowable
from PIL import Image
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet, TA_CENTER
from reportlab.graphics import barcode, renderPDF
from reportlab.graphics.shapes import *
from reportlab.graphics.barcode.qr import QrCodeWidget
import json
from num2words import num2words
styles = getSampleStyleSheet()
styleN = styles['Normal']
styleH = styles['Heading1']

def createTable(contract, themeColor, isGst, stateCode, stateValue):
    tableHeaderStyle = styles['Normal'].clone('tableHeaderStyle')
    tableHeaderStyle.textColor = colors.white
    tableHeaderStyle.fontSize = 7

    pHeadDetails = Paragraph('<strong>Details of Products & Services</strong>', tableHeaderStyle)
    pHeadTaxCode = Paragraph('<strong>HSN/<br/>SAC</strong>', tableHeaderStyle)
    pHeadQty = Paragraph('<strong>Qty</strong>', tableHeaderStyle)
    pHeadPrice = Paragraph('<strong>Rate</strong>', tableHeaderStyle)
    pHeadTotal = Paragraph('<strong>Total</strong>', tableHeaderStyle)
    pHeadTax = Paragraph('<strong>IGST </strong>', tableHeaderStyle)
    pHeadcgst = Paragraph('<strong>CGST </strong>', tableHeaderStyle)
    pHeadsgst = Paragraph('<strong>SGST </strong>', tableHeaderStyle)
    pHeadSubTotal = Paragraph('<strong>Sub Total</strong>', tableHeaderStyle)

    if isGst == False:
        if stateCode == '29':
            data = [[pHeadDetails, pHeadTaxCode, pHeadPrice,
                     pHeadQty, pHeadTotal, pHeadcgst, pHeadsgst, pHeadSubTotal]]
        else:
            if stateValue =='KA':
                data = [[pHeadDetails, pHeadTaxCode, pHeadPrice,
                         pHeadQty, pHeadTotal, pHeadcgst, pHeadsgst, pHeadSubTotal]]
            else:
                data = [[pHeadDetails, pHeadTaxCode, pHeadPrice,
                    pHeadQty, pHeadTotal, pHeadTax, pHeadSubTotal]]
    else:
        data = [[pHeadDetails, pHeadPrice,
            pHeadQty, pHeadTotal, pHeadSubTotal]]


    totalQuant = 0
    totalTax = 0
    grandTotal = 0
    totalVal = 0
    tableBodyStyle = styles['Normal'].clone('tableBodyStyle')
    tableBodyStyle.fontSize = 7

    for i in json.loads(contract.data):
        print i
        print i['desc']
        pDescSrc = i['desc']
        totalQuant += int(i['quantity'])
        totalTax += int(i['totalTax'])
        grandTotal += int(i['subtotal'])
        tot = 0
        tot = int(i['quantity']) * int(i['rate'])
        totalVal+=float(tot)
        if 'saleType' in i:
            pBodyProd = Paragraph(i['saleType'], tableBodyStyle)
        else:
            pBodyProd = Paragraph('Service', tableBodyStyle)

        pBodyTitle = Paragraph(pDescSrc, tableBodyStyle)
        pBodyQty = Paragraph(str(i['quantity']), tableBodyStyle)
        pBodyPrice = Paragraph(str(i['rate']), tableBodyStyle)
        if 'taxCode' in i:
            taxCode = '%s(%s %%)' % (i['taxCode'], i['tax'])
        else:
            taxCode = ''

        pBodyTaxCode = Paragraph(taxCode, tableBodyStyle)
        pBodyTax = Paragraph(str(i['totalTax']), tableBodyStyle)

        sgst = i['totalTax']/2
        pBodycgst = Paragraph(str(sgst), tableBodyStyle)
        pBodysgst = Paragraph(str(sgst), tableBodyStyle)

        pBodyTotal = Paragraph(str(tot), tableBodyStyle)
        pBodySubTotal = Paragraph(str(i['subtotal']), tableBodyStyle)
        if isGst == False:
            if stateCode == '29':
                data.append([ pBodyTitle, pBodyTaxCode, pBodyPrice,
                         pBodyQty, pBodyTotal, pBodycgst, pBodysgst, pBodySubTotal])
            else:
                if stateValue =='KA':
                    data.append([ pBodyTitle, pBodyTaxCode, pBodyPrice,
                             pBodyQty, pBodyTotal, pBodycgst, pBodysgst, pBodySubTotal])
                else:
                    data.append([ pBodyTitle, pBodyTaxCode, pBodyPrice,
                             pBodyQty, pBodyTotal, pBodyTax, pBodySubTotal])
        else:
            data.append([ pBodyTitle, pBodyPrice,
                     pBodyQty, pBodyTotal, pBodySubTotal])

    contract.grandTotal = grandTotal
    contract.totalTax = totalTax
    contract.save()
    discount = contract.discount
    discoubtedPrice = grandTotal - discount

    tableGrandStyle = tableHeaderStyle.clone('tableGrandStyle')
    tableGrandStyle.fontSize = 10

    print "stateCode : " , stateCode

    # if contract.coupon:

    if isGst == False:
        if stateCode == '29':
            totalTax1 = totalTax/2
            try:
                discoubtedPrice = str(round(discoubtedPrice)).split('.')[0]
            except :
                discoubtedPrice =  str(round(discoubtedPrice))
            data += [[ '', '', '', '', Paragraph(str(totalVal), tableBodyStyle),Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                    [ '', '', '', '', '',  Paragraph('Discount', tableBodyStyle),'', Paragraph(str(discount), tableBodyStyle)],
                    [ '', '', '', '', '',  Paragraph('Grand Total (INR)', tableHeaderStyle), '', Paragraph(discoubtedPrice, tableGrandStyle)]]
        else:
            if stateValue =='KA':
                totalTax1 = totalTax/2
                try:
                    discoubtedPrice = str(round(discoubtedPrice)).split('.')[0]
                except :
                    discoubtedPrice =  str(round(discoubtedPrice))
                data += [[ '', '', '', '', Paragraph(str(totalVal), tableBodyStyle),Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                        [ '', '', '', '', '',  Paragraph('Discount', tableBodyStyle),'', Paragraph(str(discount), tableBodyStyle)],
                        [ '', '', '', '', '',  Paragraph('Grand Total (INR)', tableHeaderStyle), '', Paragraph(discoubtedPrice, tableGrandStyle)]]
            else:
                try:
                    discoubtedPrice = str(round(discoubtedPrice)).split('.')[0]
                except :
                    discoubtedPrice =  str(round(discoubtedPrice))
                data += [[ '', '', '', '', Paragraph(str(totalVal), tableBodyStyle),Paragraph(str(totalTax), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                        [ '', '', '', '',  Paragraph('Discount', tableBodyStyle), '', Paragraph(str(discount), tableBodyStyle)],
                        [ '', '', '', '',  Paragraph('Grand Total (INR)', tableHeaderStyle), '', Paragraph(discoubtedPrice, tableGrandStyle)]]
    else:
        totalTax1 = totalTax/2
        try:
            discoubtedPrice = str(round(discoubtedPrice)).split('.')[0]
        except :
            discoubtedPrice =  str(round(discoubtedPrice))
        data += [[ '', '', '', Paragraph(str(totalVal), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                [ '', '','',  Paragraph('Discount', tableBodyStyle), Paragraph(str(discount), tableBodyStyle)],
                [ '', '','',   Paragraph('Grand Total (INR)', tableHeaderStyle), Paragraph(discoubtedPrice, tableGrandStyle)]]


    t = Table(data)
    if isGst == False:
        if stateCode == '29' or stateValue =='KA':
            ts = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                             ('VALIGN', (0, 1), (-1, -3), 'TOP'),
                             ('VALIGN', (0, -2), (-1, -2), 'TOP'),
                             ('VALIGN', (0, -1), (-1, -1), 'TOP'),
                             ('SPAN', (-3, -1), (-2, -1)),
                             ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                             ('BACKGROUND', (0, 0), (-1, 0), themeColor),
                             ('LINEABOVE', (0, 0), (-1, 0), 0.25, themeColor),
                             ('LINEABOVE', (0, 1), (-1, 1), 0.25, themeColor),
                             # ('BACKGROUND', (-3, -2), (-1, -2), colors.HexColor('#eeeeee')),
                             ('BACKGROUND', (-3, -1), (-1, -1), themeColor),
                             # ('LINEABOVE', (-3, -2), (-1, -2), 0.25, colors.gray),
                             ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                             # ('LINEBELOW',(0,-1),(-1,-1),0.25,colors.gray),
                             ])
        else:
            ts = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                             ('VALIGN', (0, 1), (-1, -3), 'TOP'),
                             ('VALIGN', (0, -2), (-1, -2), 'TOP'),
                             ('VALIGN', (0, -1), (-1, -1), 'TOP'),
                             ('SPAN', (-3, -1), (-2, -1)),
                             ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                             ('BACKGROUND', (0, 0), (-1, 0), themeColor),
                             ('LINEABOVE', (0, 0), (-1, 0), 0.25, themeColor),
                             ('LINEABOVE', (0, 1), (-1, 1), 0.25, themeColor),
                             # ('BACKGROUND', (-2, -2), (-1, -2), colors.HexColor('#eeeeee')),
                             ('BACKGROUND', (-3, -1), (-1, -1), themeColor),
                             # ('LINEABOVE', (-2, -2), (-1, -2), 0.25, colors.gray),
                             ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                             # ('LINEBELOW',(0,-1),(-1,-1),0.25,colors.gray),
                             ])
    else:
        ts = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                         ('VALIGN', (0, 1), (-1, -3), 'TOP'),
                         ('VALIGN', (0, -2), (-1, -2), 'TOP'),
                         ('VALIGN', (0, -1), (-1, -1), 'TOP'),
                         # ('SPAN', (-3, -1), (-2, -1)),
                         # ('SPAN', (-2, -1), (-1, -1)),
                         ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                         ('BACKGROUND', (0, 0), (-1, 0), themeColor),
                         ('LINEABOVE', (0, 0), (-1, 0), 0.25, themeColor),
                         ('LINEABOVE', (0, 1), (-1, 1), 0.25, themeColor),
                         ('BACKGROUND', (-2, -1), (-1, -1), themeColor),
                         ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                         ])
    t.setStyle(ts)
    if isGst == False:
        if stateCode == '29' or stateValue =='KA':
            t._argW[0] = 6.4 * cm
            t._argW[1] = 2.4 * cm
            t._argW[2] = 2 * cm
            t._argW[3] = 1.2 * cm
            t._argW[4] = 2 * cm
            t._argW[5] = 1.5 * cm
            t._argW[6] = 2.0 * cm
            t._argW[7] = 2.1 * cm
        else:
            t._argW[0] = 6.5 * cm
            t._argW[1] = 2.4 * cm
            t._argW[2] = 2 * cm
            t._argW[3] = 1.2 * cm
            t._argW[4] = 2 * cm
            t._argW[5] = 1.5 * cm
            t._argW[6] = 2.3 * cm
    else:
            t._argW[0] = 7 * cm
            t._argW[1] = 2.4 * cm
            t._argW[2] = 2 * cm
            t._argW[3] = 2.5 * cm
            t._argW[4] = 3 * cm
            # t._argW[5] = 1.5 * cm
    return(t , discoubtedPrice)
