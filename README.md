# Case 1: Commodities dispensing
[Cases](https://www.uio.no/studier/emner/matnat/ifi/IN5320/h21/project/project-cases.html)

## Requirements/assumptions

- MVP:
  - Dispensing ("Register when a commodity is dispensed")
  - No permissions/roles
  - Order quantities
  - Adding incoming stock
- Internet outages: pen-and-paper fallback; possibility to update when internet is restored
- View stock levels/contact details for other hospitals
- Order tracking ("Ordered 200 condoms on March 14th")
- Shrinkage reconciliation
- Write-offs with reasons (eg, expiration)
- Transaction history
- Set stock target levels
- Historical stock levels (to estimate future consumption/set future targets)

## Presentation 1: Monday, October 25th

[Slides](https://docs.google.com/presentation/d/1zDZwuonY_7xd3hhSQx8vuzcgfKP4MYL8gid-KXhy4Sk/edit?usp=sharing)



## Connecting to the DHIS2 instance 
use this instance for project work
```bash
https://verify.dhis2.org/in5320/
```
credentials: 
```
username: admin
password: district 
```

### CORS (Cross-origin resource sharing)
start proxy with: 
```
npx dhis-portal --target=https://verify.dhis2.org/in5320/
```

http://localhost:9999 now redicrects to the instance. 
login using: 
```
Server: http://localhost:9999
username: admin
password: district
```
