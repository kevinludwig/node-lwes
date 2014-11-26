{
    var db = {};
    var eventName = null;
    var attributeValue = null;
    var attributeName = null;
    
    var dbg = false;
    function debug(s) {
        if (dbg) console.log(s);
    }
    function initAttributeValue() {
        if (!attributeValue) attributeValue = newAttribute();
    }
    function newAttribute() {
        debug("Creating new attribute");
        return {
            required: false,
            nullable: false,
            typeName: null,
            arraySize: null,
            value: null
        };
    }
}
Start = Event+ {return db;}

/* event */
Event = EOS* EventWord EventBody { debug("Event called"); eventName = null; }
EventWord = WS* s:Symbol EOS? { debug("Event name called"); eventName = s;}
EventBody = WS* OpenBrace EOS? AttributeBody* ClosedBrace EOS?

/* attributes */
AttributeBody = WS* (Modifiers WS+)? TypeName WS+ AttributeWord ArraySpec? (WS+ Equals WS+ DefaultValue)? WS* SemiColon EOS?
{
    debug("Attribute Body called");
    if (!db[eventName]) {
        db[eventName] = {};
    }
    db[eventName][attributeName] = attributeValue;
    attributeName = null;
    attributeValue = null;
}

AttributeWord = Symbol { debug("AttributeName called"); attributeName = text(); }
NumericTypes = "int16" / "uint16" / "int32" / "uint32" / "int64" / "uint64" / "float" / "double"
TypeName = t:("byte" / NumericTypes / "string" / "ip_addr" / "boolean") 
{
    debug("Typename called");
    initAttributeValue();
    attributeValue.typeName = t;
}

Modifiers = RequiredModifier (WS+ NullableModifier)? / NullableModifier (WS+ RequiredModifier)? 
RequiredModifier = r:("required" / "optional") 
{ 
    debug("Required called");
    initAttributeValue(); 
    attributeValue.required = r === 'required'; 
}
NullableModifier = "nullable" 
{ 
    debug("Nullable called");
    initAttributeValue(); 
    attributeValue.nullable = true; 
}
DefaultValue = val:(QuotedString / DecimalNumber / Integer / IpAddress)
{
    debug("Default value called");
    initAttributeValue(); 
    attributeValue.value = val; 
}

ArraySpec = OpenBracket n:Integer ClosedBracket 
{
    debug("Array spec called");
    initAttributeValue(); 
    attributeValue.arraySize = n;
}

/* comments */
Comment = Hash (!LineTerminator AnyChar)*

/* statement terminator */
EOS = WS* Comment? LineTerminator

/* tokens */
AnyChar = .
DoubleQuote = '"'
Hash = '#'
Equals = "="
SemiColon = ";"
OpenBrace = "{"
ClosedBrace = "}"
OpenBracket = "["
ClosedBracket = "]"
WS = " " / "\t" / "\f" 
LineTerminator = "\n" / "\r" / "\r\n"
Alpha = [a-zA-Z]
Underscore = "_"
Colon = ":"
Plus = "+"
Minus = "-"
Period = "."

/* Data types */

Symbol = Alpha (Alpha / AnyNumber / Underscore / Colon)* {return text();}
QuotedString = DoubleQuote chars:StringChar+ DoubleQuote {return chars.join('');}
StringChar = !DoubleQuote AnyChar {return text();}

Sign = Plus / Minus
NumberNoZero = [1-9]
AnyNumber = [0-9]
Integer = "0" / Sign? NumberNoZero AnyNumber* 
{
    debug("Integer:"+text());
    return parseInt(text(),10);
}
DecimalNumber = Integer Period AnyNumber+ 
{
    debug("DecimalNumber:"+text());
    return parseFloat(text());
}
IpNum = [0-2][0-9]?[0-9]?
IpAddress =  DoubleQuote ip:(IpNum "." IpNum "." IpNum "." IpNum) DoubleQuote {return ip.join('');}
