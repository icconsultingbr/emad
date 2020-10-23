'use strict';

class QueryBuilder {
    static sort(query, sortColumn, sortOrder) {
        if (!sortColumn) {
            return query;
        }
    
        sortOrder = sortOrder || 'ASC';
    
        return `SELECT * FROM (${query} ORDER BY ${sortColumn} ${sortOrder}) X`;
    }

    static datatable(query, sortColumn, sortOrder, limit, offset){
        if(!query){
            return;
        }

        limit = limit || 10;
        offset = offset || 0;
        query = this.sort(query, sortColumn, sortOrder);

        return query + ` LIMIT ${limit} OFFSET ${limit * offset}`;
    }
}

module.exports = QueryBuilder;