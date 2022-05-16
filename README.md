# Description 

Basic Geo api on french "commune" with Node + Express + Mongoose

# Methods : 

GET, POST, PUT, DELETE

# Routes: 

- commune (post)
- communes (get)
- commune/:id (get)
- commune/:id (put)
- commune/:id (delete)


# COMMANDS

Install the node modules 

```console
    npm install
```

Then run the project with it

```console
    npm run dev
```

# Entity

(Form urlencoded)

Commune :

    name: { type: String, required: true },
    code: { type: String, required: true },
    codeDepartment: { type: String, required: true },
    codeRegion: { type: String, required: true },
    codesPostaux: {type: String, required: true},
    population: { type: Number, required: true },


  
  
  
  
  
