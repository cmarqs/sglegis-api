
- When run the `sequelize-mig migration`
- Fix error: `Cannot read property 'fields' of undefined`
- Workarround:
```
In de _current.json change "indexes": [] to "indexes": {} on the model you added the index
```